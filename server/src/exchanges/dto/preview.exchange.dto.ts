import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PreviewDto {

	@IsString()
	@IsNotEmpty()
	assetFromSymbol: string

	@IsString()
	@IsNotEmpty()
	assetToSymbol: string

	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	amount: number
}