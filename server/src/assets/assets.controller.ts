import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto } from './dto';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { Role } from '@prisma/client';
import { AssetResponse } from './responses/asset.response';


@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }


  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  createAssets(@Body() dto: CreateAssetDto, @Req() req) {
    return this.assetsService.createAsset(dto, req.user.id)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get(':id')
  async AssetById(@Param('id', ParseUUIDPipe) id: string) {
    const asset = await this.assetsService.getAssetById(id)
    return new AssetResponse(asset)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateAsset(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssetDto,) {
    return this.assetsService.updateAsset(id, dto);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteAsset(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.deleteAsset(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get()
  async getAll() {
    const assets = await this.assetsService.getAllAssets();

    return assets.map(asset => new AssetResponse(asset));
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  // @Get('deposit-address')
  // async getDepositAddress(@Query('coin') coin: string, @Query('network') network?: string) {
  //   return this.assetsService.getDepositAddress(coin, network);
  // }

  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  // @Get('account')
  // async getBinanceAccount() {
  //   return this.assetsService.getAccountIno();
  // }
}
