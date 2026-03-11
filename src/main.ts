import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions/all-exceptions.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter(),
    new DatabaseExceptionFilter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
