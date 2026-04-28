import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAssetDto, GetAssetDto, UpdateAssetDto } from './dto';
import { BinanceService } from 'src/binance/binance.service';
import { PrismaClient } from '@prisma/client';
import { PrismaWhereBuilder } from 'src/utils/prisma-query-builders';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AssetsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly binanceService: BinanceService,
		private readonly configService: ConfigService,

	) { }

	private getFullImageUrl(imagePath: string | null): string | null {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http')) return imagePath;

		const baseUrl = this.configService.get('REACT_APP_S3_PUBLIC_URL');

        return `${baseUrl}/${imagePath}`;
    }
	async getAvailableCoins() {
		const config = await this.binanceService.getCoinConfig();

		return config
			.filter(c => c.depositAllEnable || c.withdrawAllEnable)
			.map(c => ({
				symbol: c.coin,
				name: c.name,
			}));
	}
	async getNetworksByCoin(symbol: string) {
		const config = await this.binanceService.getCoinConfig();

		const coin = config.find(c => c.coin === symbol);
		if (!coin) {
			throw new NotFoundException('Coin not found on Binance');
		}
		const coinFromDb = await this.prismaService.coin.findUnique({
			where: { symbol },
			include: { networks: true },
		});
		const availableNetworksForSelectedCoin = coin.networkList
			.filter(n => n.depositEnable || n.withdrawEnable)
			.map(n => ({
				network: n.network,
				name: n.name,
			}));
		const existingNetworks = coinFromDb?.networks.map(n => n.name) ?? []

		return { existingNetworks, availableNetworksForSelectedCoin,imageUrl: this.getFullImageUrl(coinFromDb?.imageUrl)}
	}
	async createAsset(dto: CreateAssetDto) {
		return this.prismaService.$transaction(async (tx) => {
			const netInfo = await this.binanceService.getNetworkInfo(
				dto.coin,
				dto.network
			);
			const deposit = await this.binanceService.getDepositAddress(
				dto.coin,
				dto.network
			);
			const coin = await tx.coin.upsert({
				where: { symbol: dto.coin },
				update: {
					isActive: true,
					...(dto.imageUrl && { imageUrl: dto.imageUrl }),
				},
				create: {
					symbol: dto.coin,
					name: dto.coin,
					imageUrl: dto.imageUrl,
				},
			});


			const existing = await tx.network.findFirst({
				where: {
					coinId: coin.id,
					name: netInfo.code,
				},
			});

			if (existing) {
				throw new BadRequestException(
					`${dto.coin}-${dto.network} already exists`
				);
			}


			return tx.network.create({
				data: {
					coinId: coin.id,
					name: netInfo.code,
					chainName: netInfo.chainName,

					withdrawFee: netInfo.withdrawFee,
					withdrawMin: netInfo.withdrawMin,
					withdrawMax: netInfo.withdrawMax,
					depositDust: netInfo.depositDust,

					addressRegex: netInfo.addressRegex,
					memoRegex: netInfo.memoRegex,
					requiresMemo: netInfo.requiresMemo,

					minConfirm: netInfo.minConfirm,
					estimatedArrivalTime: netInfo.estimatedArrivalTime,

					contractAddress: netInfo.contractAddress,
					explorerUrl: netInfo.explorerUrl,

					depositAddress: deposit.address,
					depositMemo: deposit.memo,
				},
			});
		});
	}
	private async getDistinctRecords(table: string, fieldName: string, includeEmpty = false): Promise<string[]> {
		const where: any = {};

		if (!includeEmpty) {
			where[fieldName] = {
				notIn: [''],
				not: undefined,
			};
		}

		const model = (this.prismaService as any)[table];

		if (!model) {
			throw new Error(`Table ${table} not found`);
		}

		try {
			const records = await model.findMany({
				where,
				select: { [fieldName]: true },
				distinct: [fieldName],
				orderBy: { [fieldName]: 'asc' },
			});

			return records.map((item: any) => item[fieldName]);
		} catch (error) {
			console.error('Prisma Error Details:', error);
			throw error;
		}
	}
	async getAssetFilters() {
		const [coins, networks] = await Promise.all([
			this.getDistinctRecords('coin', 'symbol'),
			this.getDistinctRecords('network', 'name'),
		]);

		return {
			coins: coins.map(c => ({ label: c, value: c })),
			networks: networks.map(n => ({ label: n, value: n })),
		};
	}
	async getAllAssets(dto: GetAssetDto) {
		const { page = 1, limit = 10, search, coins, networks, isActive } = dto;

		const pageNum = Number(page) || 1;
		const limitNum = Number(limit) || 10;
		const skip = (pageNum - 1) * limitNum;

		const coinWhere = new PrismaWhereBuilder()
			.in('symbol', coins)
			.contains(['name', 'symbol'], search)
			.build();

		const where = new PrismaWhereBuilder()
			.in('name', networks)
			.equals('isActive', isActive)
			.relation('coin', coinWhere) 
			.build();
		const [items, total] = await Promise.all([
			this.prismaService.network.findMany({
				where,
				include: { coin: true },
				skip,
				take: limitNum,
				orderBy: { 
					createdAt: 'desc',
				},
			}),
			this.prismaService.network.count({ where }),
		]);

		const config = await this.binanceService.getCoinConfig();

		const data = items.map((network) => {
			const netInfo = config
				.find((c) => c.coin === network.coin.symbol)
				?.networkList.find((n) => n.network === network.name);

			return {
				id: network.id,

				symbol: network.coin.symbol,
				name: network.coin.name,
				imageUrl: this.getFullImageUrl(network.coin.imageUrl),

				network: network.name,
				networkSignature: netInfo?.name || network.chainName,

				withdrawFee: network.withdrawFee,
				withdrawMin: network.withdrawMin,
				withdrawMax: network.withdrawMax,
				depositDust: network.depositDust,

				address: network.depositAddress,
				isActive: network.isActive,
			};
		});

		return {
			data,
			meta: {
				total,
				page: pageNum,
				limit: limitNum,
				totalPage: Math.ceil(total / limitNum),
			},
		};
	}
	async getCountActiveAssets() {
		const [allAssets, activeAssets] = await Promise.all([
			this.prismaService.network.count(),
			this.prismaService.network.count({ where: { isActive: true } })
		])
		return {
			allAssets, activeAssets
		}
	}
	async getAssetById(id: string) {
		const asset = await this.prismaService.network.findFirst({
			where: { id },
			include: { coin: true }
		});
		if (!asset) {
			return null;
		}
		return {
			...asset,
			imageUrl: this.getFullImageUrl(asset.coin.imageUrl),
			withdrawFee: Number(asset.withdrawFee),
			withdrawMin: Number(asset.withdrawMin),
			withdrawMax: Number(asset.withdrawMax),
			depositDust: Number(asset.depositDust)
		};
	}
	async updateAsset(id: string, dto: UpdateAssetDto) {
		try {
			return await this.prismaService.network.update({
				where: { id },
				data: {
					isActive: dto.isActive
				}
			});
		} catch {
			throw new NotFoundException('Asset not found');
		}
	}
	async deleteAsset(id: string) {
		const asset = await this.prismaService.network.findUnique({
			where: { id },
		});

		if (!asset) {
			throw new NotFoundException('Asset not found');
		}

		await this.prismaService.network.delete({
			where: { id },
		});

		return {
			message: 'Asset successfully deleted',
		};
	}
}
