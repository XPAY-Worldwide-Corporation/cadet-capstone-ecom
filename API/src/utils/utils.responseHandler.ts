import { HttpStatus } from '@nestjs/common';

export function responseHandler(
  data: any,
  message: string,
  statusCode: number = HttpStatus.OK,
) {
  return {
    statusCode,
    message,
    data,
  };
}
