import { Exclude, Expose } from 'class-transformer';
import { Asset } from '@prisma/client';

@Exclude()
export class AssetResponse {

	@Expose()
	id: string;

	@Expose()
	coin: string;

	@Expose()
	network: string;

	@Expose()
	address: string;

	@Expose()
	withdrawFee: number;

	@Expose()
	withdrawMin: number;

	@Expose()
	depositDust: number;

	@Expose()
	networkSignature: string;

	@Expose()
	imageUrl: string;

	@Expose()
	isActive: boolean;

	constructor(partial: Partial<Asset>) {
		Object.assign(this, partial);
	}
}