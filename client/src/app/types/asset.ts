export interface ICoin {
	id: string;
	symbol: string;
	name: string;
	imageUrl?: string;
	networks: INetwork[];
}
export interface INetwork {
	id: string;
	name: string;
	chainName: string;
	networkSignature: string;

	isActive: boolean;

	withdrawFee: number;
	withdrawMin: number;
	withdrawMax: number;
	depositDust: number;

	addressRegex: string;
	memoRegex?: string;
	requiresMemo: boolean;

	minConfirm: number;
	estimatedArrivalTime: number;

	contractAddress?: string;
	explorerUrl?: string;

	depositAddress: string;
	depositMemo?: string;
}
export interface AvailableCoin {
	symbol: string;
	name: string;
}

export interface AvailableNetworkByCoin {
	availableNetworksForSelectedCoin: {
		network: string;
		name: string;
	}[];
	existingNetworks: string[];
}
export interface CountAssets {
	allAssets: number;
	activeAssets: number;
}
export interface UpdateAsset {
	id: string;
	isActive: boolean;
}
export interface ProfileAsset{
	id: string;
	chainName: string;
	networkSignature: string;
	depositAddress: string;
	isActive: boolean;
	withdrawFee: number;
	withdrawMin: number;
	withdrawMax: number;
	depositDust: number;
	coin:ICoin
}
