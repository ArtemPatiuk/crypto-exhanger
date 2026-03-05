import { Exclude, Expose } from 'class-transformer';
import { Coin, Network } from '@prisma/client';

@Exclude()
export class AssetResponse {
	id: string;
	coin: string;
	network: string;
	networkSignature: string;
	imageUrl?: string;
	isActive: boolean;

	constructor(asset: any) {
		this.id = asset.id;
		this.coin = asset.coin?.symbol ?? asset.coin; 
		this.network = asset.network;
		this.networkSignature = asset.networkSignature;
		this.imageUrl = asset.imageUrl;
		this.isActive = asset.isActive;
	}
}