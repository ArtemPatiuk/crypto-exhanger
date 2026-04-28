import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AssetsModule } from './assets/assets.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { BinanceModule } from './binance/binance.module';
import {FileStorageModule} from '@getlarge/nestjs-tools-file-storage';
import { FilesModule } from './files/files.module';
import { fileStorageConfig } from './config/file-storage.config';

@Module({
    imports:
    [
        UserModule,
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        AssetsModule,
        ExchangesModule,
        BinanceModule,
        FilesModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
