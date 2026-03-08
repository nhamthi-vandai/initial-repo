import { FastifyReply } from 'fastify';
import { ApiResponse, ApiError } from '../types/response.types';

export class ResponseUtil {
  static success<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any,
  ): FastifyReply {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      response.meta = meta;
    }

    return reply.status(statusCode).send(response);
  }

  static error(
    reply: FastifyReply,
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    details?: any,
  ): FastifyReply {
    const response: ApiError = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errorCode || details) {
      response.error = {
        code: errorCode || 'INTERNAL_ERROR',
        details,
      };
    }

    return reply.status(statusCode).send(response);
  }

  static created<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Resource created successfully',
  ): FastifyReply {
    return this.success(reply, data, message, 201);
  }

  static noContent(reply: FastifyReply): FastifyReply {
    return reply.status(204).send();
  }

  static notFound(reply: FastifyReply, message: string = 'Resource not found'): FastifyReply {
    return this.error(reply, message, 404, 'NOT_FOUND');
  }

  static badRequest(reply: FastifyReply, message: string, details?: any): FastifyReply {
    return this.error(reply, message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(reply: FastifyReply, message: string = 'Unauthorized'): FastifyReply {
    return this.error(reply, message, 401, 'UNAUTHORIZED');
  }

  static forbidden(reply: FastifyReply, message: string = 'Forbidden'): FastifyReply {
    return this.error(reply, message, 403, 'FORBIDDEN');
  }
}
