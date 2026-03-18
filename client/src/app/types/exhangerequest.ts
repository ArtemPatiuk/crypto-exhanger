import { IAsset } from './asset';

export interface ExchangeRequest {
	id: string;

	userId: string;

	assetFromId: string | null;
	assetToId: string | null;

	amount: number;
	commission: number;
	exchangeRate: number;
	totalSum: number;

	depositAddress: string;
	recipientAddress: string;

	status: ExchangeStatus;

	assetFrom: IAsset;
	assetTo: IAsset;

	createdAt: string;
}

export type ExchangeStatus = "PENDING" | "WAITING_PAYMENT" | "PAID" | "COMPLETED" | "CANCELLED";
