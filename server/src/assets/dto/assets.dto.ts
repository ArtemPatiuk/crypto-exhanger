import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, IsBoolean } from 'class-validator';
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

