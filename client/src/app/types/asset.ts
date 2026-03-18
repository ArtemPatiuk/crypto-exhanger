import { Pagination } from './pagination';

export interface IAsset {
	id: string;
	symbol: string;
	name: string;
	imageUrl?: string;
	network: string;
	networkSignature: string;
	withdrawFee: string;
	withdrawMin: string;
	withdrawMax: string;
	depositDust: string;
	address: string;
	isActive: boolean;
}
// ------
export interface AssetFilters {
	coins?: string[];
	networks?: string[];
	isActive?: boolean;
	search?: string;
}
export interface GetAllAssetsRequest {
	pagination: Pagination;
	filters: AssetFilters;
}
export interface AssetFilterOption {
	label: string;
	value: string;
}
export interface AssetFiltersResponse {
	coins: AssetFilterOption[];
	networks: AssetFilterOption[];
}
// ------
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
export interface ProfileAsset {
	id: string;
	chainName: string;
	networkSignature: string;
	depositAddress: string;
	isActive: boolean;
	withdrawFee: number;
	withdrawMin: number;
	withdrawMax: number;
	depositDust: number;
	coin: IAsset
}
