import { ICoin } from './asset';

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

	assetFrom: ICoin;
	assetTo: ICoin;

	createdAt: string;
}

export type ExchangeStatus = "PENDING" | "WAITING_PAYMENT" | "PAID" | "COMPLETED" | "CANCELLED";
