import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  UniqueConstraintViolationException,
  NotFoundError,
} from '@mikro-orm/core';

@Catch(UniqueConstraintViolationException, NotFoundError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(
    exception: UniqueConstraintViolationException | NotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let error: string;
    let message: string;

    if (exception instanceof UniqueConstraintViolationException) {
      statusCode = HttpStatus.CONFLICT;
      error = 'CONFLICT';
      message = 'A record with this value already exists';
    } else if (exception instanceof NotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      error = 'NOT_FOUND';
      message = 'Record not found';
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'DATABASE_ERROR';
      message = 'A database error occurred';
    }

    this.logger.error(
      `[DB] ${request.method} ${request.url} — ${exception.message}`,
    );

    response.status(statusCode).json({
      success: false,
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
