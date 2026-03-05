import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser())
    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.enableCors({
        origin: ['http://localhost:3000', 'http://192.168.0.205:3000'],
        credentials: true,
    });
    const port = process.env.PORT ?? 8000;
    await app.listen(port, '0.0.0.0'); 
    console.log(`Server running on port ${port}`);
}
bootstrap();
