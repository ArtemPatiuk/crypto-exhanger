import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Spot } from '@binance/connector';

@Injectable()
export class BinanceService {
	private client: Spot;

	private coinConfigCache: any = null;
	private lastCacheUpdate = 0;
	private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 час

	constructor() {
		this.client = new Spot(
			process.env.BINANCE_API_KEY ?? '',
			process.env.BINANCE_API_SECRET ?? '',
			{ adjustTime: true }
		);

	}

	async getSpotPrice(assetFrom: string, assetTo: string) {
		const directSymbol = `${assetFrom}${assetTo}`.toUpperCase();
		const reversedSymbol = `${assetTo}${assetFrom}`.toUpperCase();

		try {
			const response = await this.client.tickerPrice(directSymbol);
			return {
				price: Number(response.data.price),
				reversed: false,
				symbol: directSymbol
			}
		} catch {
			try {
				const response = await this.client.tickerPrice(reversedSymbol);
				return {
					price: Number(response.data.price),
					reversed: true,
					symbol: reversedSymbol,
				};
			} catch {
				throw new BadRequestException('Pair not supported on Binance');
			}
		}
	}
	async getCoinConfig() {
		try {
			const now = Date.now();
			if (!this.coinConfigCache || now - this.lastCacheUpdate > this.CACHE_DURATION) {
				const response = await this.client.signRequest(
					'GET',
					'/sapi/v1/capital/config/getall'
				);
				this.coinConfigCache = response.data;
				this.lastCacheUpdate = now;
			}
			return this.coinConfigCache;
		} catch (error) {
			console.error('Error fetching coin config:', error.response?.data || error);
			throw new InternalServerErrorException('Не вдалось отримати інформацію про монети з Binance');
		}
	}
	async getNetworkInfo(symbol: string, network: string) {
		const config = await this.getCoinConfig();

		const coin = config.find(c => c.coin === symbol);
		if (!coin) {
			throw new BadRequestException(`Coin ${symbol} not found on Binance`);
		}

		const net = coin.networkList.find(n => n.network === network);
		if (!net) {
			throw new BadRequestException(
				`Network ${network} not found for ${symbol}`
			);
		}

		return {
			code: net.network,                
			chainName: net.name,              
			withdrawFee: Number(net.withdrawFee),
			withdrawMin: Number(net.withdrawMin),
			withdrawMax: Number(net.withdrawMax),
			depositDust: Number(net.depositDust),
			addressRegex: net.addressRegex,
			memoRegex: net.memoRegex,
			requiresMemo: net.withdrawTag,
			minConfirm: net.minConfirm,
			estimatedArrivalTime: net.estimatedArrivalTime,
			contractAddress: net.contractAddress,
			explorerUrl: net.contractAddressUrl, 
		};
	}
	async getDepositAddress(coin: string, network?: string) {
		try {
			const options: any = {};
			if (network) options.network = network;

			const response = await this.client.depositAddress(coin, options);

			return {
				address: response.data.address,
				memo: response.data.tag || null,
				url: response.data.url,
			};
		} catch (error) {
			throw new InternalServerErrorException(
				error.response?.data?.msg || 'Failed to fetch deposit address'
			);
		}
	}

	async sendCrypto(asset: string, amount: string, address: string, network: string) {
		try {
			const response = await this.client.withdraw(asset, address, amount, { network });
			return response.data;
		} catch (error) {
			console.error('Error sending crypto:', error.response?.data || error);
			throw new InternalServerErrorException('Не вдалось відправити криптовалюту');
		}
	}
	// async getAccountBalances() {
	// 	try {
	// 		const response = await this.client.signRequest('GET', '/api/v3/account');
	// 		return response.data;
	// 	} catch (error) {
	// 		throw new Error('Не вдалось отримати дані про аккаунт Binance');
	// 	}
	// }
}
