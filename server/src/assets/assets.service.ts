import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto } from './dto';
import { BinanceService } from 'src/binance/binance.service';


@Injectable()
export class AssetsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly binanceService: BinanceService

	) { }

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

		return { existingNetworks, availableNetworksForSelectedCoin }
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
					imageUrl: dto.imageUrl,
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
	async getAllAssets() {
		const coins = await this.prismaService.coin.findMany({
			where: { isActive: true },
			include: {
				networks: true
			},
		});

		const config = await this.binanceService.getCoinConfig();

		return coins.map(coin => ({
			id: coin.id,
			symbol: coin.symbol,
			name: coin.name,
			imageUrl: coin.imageUrl,
			networks: coin.networks.map(network => {
				const netInfo = config
					.find(c => c.coin === coin.symbol)
					?.networkList.find(n => n.network === network.name);

				return {
					id: network.id,
					name: network.name,
					chainName: network.chainName,
					networkSignature: netInfo?.name || network.chainName,
					isActive:network.isActive,
					withdrawFee: network.withdrawFee,
					withdrawMin: network.withdrawMin,
					withdrawMax: network.withdrawMax,
					depositDust: network.depositDust,

					addressRegex: network.addressRegex,
					memoRegex: network.memoRegex,
					requiresMemo: network.requiresMemo,

					minConfirm: network.minConfirm,
					estimatedArrivalTime: network.estimatedArrivalTime,

					contractAddress: network.contractAddress,
					explorerUrl: network.explorerUrl,

					depositAddress: network.depositAddress,
					depositMemo: network.depositMemo,
				};
			}),
		}));
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
