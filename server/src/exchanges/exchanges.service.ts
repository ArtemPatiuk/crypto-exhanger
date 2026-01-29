import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateExchangeDto } from './dto';
import { ExchangeStatus } from '@prisma/client';
import { JwtPayload } from '@auth/interfaces';

@Injectable()
export class ExchangesService {
	constructor(private readonly prismaService: PrismaService) { }

	async getAll() {
		return this.prismaService.exchangeRequest.findMany({
			orderBy: { createdAt: 'desc' },
			include: { assetFrom: true, assetTo: true, user: true }
		})
	}
	async getUserExchanges(userId?: string) {
		const exchanges = await this.prismaService.exchangeRequest.findMany({
			where: userId ? { userId } : undefined,
			include: {
				assetFrom: true,
				assetTo: true,
				user: true,
			},
		});

		return exchanges;
	}

	async getExhangeById(id: string, currentUser: JwtPayload) {
		const exchange = await this.prismaService.exchangeRequest.findUnique({
			where: { id },
			include: { assetFrom: true, assetTo: true, user: true, },
		})

		if (!exchange) throw new NotFoundException('Exchange not found');
		if (!currentUser.role.includes('ADMIN') && currentUser.id !== exchange.user.id) {
			throw new ForbiddenException('Access is denied')
		}
		return exchange;
	}

	async createExchange(dto: CreateExchangeDto, userId: string) {
		const assetFrom = await this.prismaService.asset.findUnique({
			where: { id: dto.assetFromId },
		});

		if (!assetFrom) {
			throw new BadRequestException('Asset not found');
		}

		return this.prismaService.exchangeRequest.create({
			data: {
				amount: Number(dto.amount),
				commission: Number(dto.commission),
				exchangeRate: Number(dto.exchangeRate),
				totalSum: Number(dto.totalSum),
				depositAddress: assetFrom.address,
				recipientAddress: dto.recipientAddress,
				status: ExchangeStatus.WAITING_PAYMENT,

				user: { connect: { id: userId } },
				assetFrom: { connect: { id: dto.assetFromId } },
				assetTo: { connect: { id: dto.assetToId } },
			},
		});
	}
}
