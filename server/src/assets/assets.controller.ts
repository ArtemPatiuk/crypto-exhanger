import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto, GetAssetDto, UpdateAssetDto } from './dto';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { Role } from '@prisma/client';



@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }
  @Public()
  @Get()
  async getAll(@Query() dto: GetAssetDto) {
    const assets = await this.assetsService.getAllAssets(dto);
    return assets
  }
  @Get('filters')
  async getFilters() {
    return await this.assetsService.getAssetFilters();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('get-coins-list')
  async getCoins() {
    return this.assetsService.getAvailableCoins();
  }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':symbol/networks')
  getNetworks(@Param('symbol') symbol: string) {
    return this.assetsService.getNetworksByCoin(symbol);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('get-coin-count')
  getCountAssets() {
    return this.assetsService.getCountActiveAssets()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  createAssets(@Body() dto: CreateAssetDto) {
    return this.assetsService.createAsset(dto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get(':id')
  async AssetById(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.getAssetById(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateAsset(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssetDto,) {
    return this.assetsService.updateAsset(id, dto);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteAsset(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.deleteAsset(id);
  }

  ///////////////////////////////////////////////////////////////////////////
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
