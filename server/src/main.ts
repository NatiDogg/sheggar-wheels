import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
   app.use(cookieParser());

  app.useGlobalPipes(
     new ValidationPipe({
        disableErrorMessages: false,
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
     }),
  );

  const config = new DocumentBuilder()
    .setTitle('SheggerWheels API')
    .setDescription('The API documentation for SheggerWheels Application')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  
  const document = SwaggerModule.createDocument(app, config);

  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
