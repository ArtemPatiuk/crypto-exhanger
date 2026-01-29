import { ExchangeStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExchangeDto {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	assetFromId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	assetToId: string;

	@IsNumber()
	@IsNotEmpty()
	amount: number;

	@IsNumber()
	@IsNotEmpty()
	commission: number;

	@IsNumber()
	@IsNotEmpty()
	exchangeRate: number;

	@IsNumber()
	@IsNotEmpty()
	totalSum: number;

	@IsString()
	@IsNotEmpty()
	depositAddress: string;

	@IsString()
	@IsNotEmpty()
	recipientAddress: string;

	@IsOptional()
	status?: ExchangeStatus

}