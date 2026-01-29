import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { CurrentUser, Public, Roles } from '@common/decorators';
import { CreateExchangeDto } from './dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@prisma/client';
import { JwtPayload } from '@auth/interfaces';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) { }


  @Roles(Role.ADMIN)
  @Get()
  getAll() {
    return this.exchangesService.getAll();
  }

  @Get('userexchanges')
  getExchangesByUser(@CurrentUser() user: JwtPayload) {
    const filterUserId = user.role.includes(Role.ADMIN) ? undefined : user.id;
    return this.exchangesService.getUserExchanges(filterUserId)
  }

  @Get(':id')
  getExchangesProfile(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.exchangesService.getExhangeById(id, user)
  }

  @Post()
  createExchange(@Body() dto: CreateExchangeDto, @CurrentUser() user: JwtPayload) {
    return this.exchangesService.createExchange(dto, user.id)
  }
}
