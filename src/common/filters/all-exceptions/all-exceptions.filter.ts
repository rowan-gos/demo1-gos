import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // no argument = catches everything
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // If it's a known HttpException, delegate its status
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'An unexpected error occurred';

    // Log the full error internally — never expose stack to client
    this.logger.error(
      `[${statusCode}] ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(statusCode).json({
      success: false,
      statusCode,
      error: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
