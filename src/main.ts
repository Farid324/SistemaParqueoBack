import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/infrastructure/http/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/infrastructure/http/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS restringido por variable de entorno (coma-separado); abierto solo en desarrollo
  const corsOrigin = config.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((origin) => origin.trim()) : true,
    credentials: true,
  });

  // Prefijo para la API
  app.setGlobalPrefix('api');

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SistemaParqueoBack API')
    .setDescription('Documentación de la API REST para la gestión del Sistema de Parqueo SaaS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  console.log(`🚀 App corriendo en: http://localhost:${port}/api`);
  console.log(`📚 Swagger UI en: http://localhost:${port}/api/docs`);
}
bootstrap();
