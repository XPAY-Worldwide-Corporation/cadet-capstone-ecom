import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";

@Catch()
export class addErrorHandler implements ExceptionFilter {
  private readonly logger = new Logger(addErrorHandler.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isPrismaError =
      exception instanceof Prisma.PrismaClientKnownRequestError;
    const status = isPrismaError
      ? HttpStatus.BAD_REQUEST
      : exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isPrismaError
      ? this.createPrismaErrorResponse(exception, request.url)
      : this.createErrorResponse(exception, request.url);

    this.logger.error("\x1b[31m" + JSON.stringify(errorResponse) + "\x1b[0m");

    response.status(status).json(errorResponse);
  }

  private createErrorResponse(exception: unknown, path: string) {
    const defaultMessage = RESOURCE.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : defaultMessage;
    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as any).error || defaultMessage
        : defaultMessage;

    return {
      message,
      error,
      path,
      stack:
        ENV.NODE_ENV === RESOURCE.PRODUCTION
          ? undefined
          : (exception as Error).stack,
    };
  }

  private createPrismaErrorResponse(
    exception: Prisma.PrismaClientKnownRequestError,
    path: string,
  ) {
    const detailedError = exception.message;
    const prismaCode = exception.code;

    return {
      message: detailedError,
      error: `Prisma Error (Code: ${prismaCode})`,
      path,
      stack:
        ENV.NODE_ENV === RESOURCE.PRODUCTION
          ? undefined
          : (exception as Error).stack,
    };
  }
}
