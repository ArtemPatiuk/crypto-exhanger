import { Type, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, IsBoolean, IsArray } from 'class-validator';

export class CreateAssetDto {
	@IsString()
	@IsNotEmpty()
	coin: string;

	@IsString()
	@IsNotEmpty()
	network: string;

	@IsOptional()
	@IsUrl()
	imageUrl?: string;
}

export class UpdateAssetDto {
	@IsBoolean()
	isActive: boolean;
}
export class GetAssetDto {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	page?: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true || value === '1')
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) return value;
		if (typeof value === 'string') return value.split(',').filter(Boolean);
		return value;
	})
	@IsArray()
	@IsString({ each: true })
	coins?: string[];

	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) return value;
		if (typeof value === 'string') return value.split(',').filter(Boolean);
		return value;
	})
	@IsArray()
	@IsString({ each: true })
	networks?: string[];
}

