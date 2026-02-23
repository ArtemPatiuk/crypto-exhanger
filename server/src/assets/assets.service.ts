import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto } from './dto';
import { BinanceService } from 'src/binance/binance.service';

@Injectable()
export class AssetsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly binanceService: BinanceService

	) { }

	async createAsset(dto: CreateAssetDto, userId: string) {
		const binanceData = await this.binanceService.getDepositAddress(
			dto.coin,
			dto.network,
		);
		if (!binanceData.networkInfo) {
			throw new ForbiddenException('Binance не надав інформації по мережі');
		}
		const existing = await this.prismaService.asset.findUnique({
			where: {
				coin_network: {
					coin: dto.coin,
					network: dto.network
				},
			},
		})
		if (existing) {
			throw new ConflictException('Asset already exist')
		};
		return this.prismaService.asset.create({
			data: {
				coin: dto.coin,
				network: dto.network,
				address: binanceData.address,
				networkSignature: binanceData.networkInfo.networkSignature,
				withdrawFee: parseFloat(binanceData.networkInfo.withdrawFee),
				withdrawMin: parseFloat(binanceData.networkInfo.withdrawMin),
				depositDust: parseFloat(binanceData.networkInfo.depositDust),
				createdById: userId,
				imageUrl: dto.imageUrl,
			},
		});
	}


	async getAllAssets() {
		return this.prismaService.asset.findMany({
			orderBy: { createdAt: 'desc' },
		});
	}

	async getAssetById(id: string) {
		const asset = await this.prismaService.asset.findFirst({
			where: { id }
		});
		if (!asset) {
			return null;
		}
		return asset;
	}
	async updateAsset(id: string, dto: UpdateAssetDto) {
		const asset = await this.prismaService.asset.findUnique({
			where: { id },
		});

		if (!asset) {
			throw new NotFoundException('Asset not found');
		}

		let dataToUpdate: any = { ...dto };

		const coin = dto.coin ?? asset.coin;
		const network = dto.network ?? asset.network;

		if (dto.coin || dto.network) {
			const binanceData = await this.binanceService.getDepositAddress(
				coin,
				network,
			);

			dataToUpdate = {
				...dataToUpdate,
				address: binanceData.address,
				networkSignature: binanceData.networkSignature,
				withdrawFee: binanceData.withdrawFee,
				withdrawMin: binanceData.withdrawMin,
				depositDust: binanceData.depositDust,
			};
		}

		return this.prismaService.asset.update({
			where: { id },
			data: dataToUpdate,
		});
	}
	async deleteAsset(id: string) {
		const asset = await this.prismaService.asset.findUnique({
			where: { id },
		});

		if (!asset) {
			throw new NotFoundException('Asset not found');
		}

		await this.prismaService.asset.delete({
			where: { id },
		});

		return {
			message: 'Asset successfully deleted',
		};
	}




}
