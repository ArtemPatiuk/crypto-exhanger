export interface IAsset {
	createdById: string | undefined;
	id: string;
	coin: string;
	network: string;
	address: string;
	withdrawFee: number;
	withdrawMin: number;
	depositDust: number;
	isActive: boolean;
	networkSignature: string;
	imageUrl?: string;
}
