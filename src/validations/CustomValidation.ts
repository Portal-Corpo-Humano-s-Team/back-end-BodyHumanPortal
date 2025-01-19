import { Response } from "express";

export class ValidationError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.code = "ValidationError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static handleError(res: Response, error: ValidationError) {
    if (res.headersSent) {
      return;
    }

    const statusCode = error instanceof ValidationError ? 400 : 500;
    return res.status(statusCode).json({
      status: "Error",
      message: error.message || "Erro interno do servidor",
      code: error.code || "UnexpectedError",
    });
  }
}

export class SuccessResponse {
  static send(res: Response, statusCode: number, message: string, data?: any) {
    const responseBody: any = {
      success: true,
      message: message,
    };

    if (data) {
      responseBody.data = data;
    }

    return res.status(statusCode).json(responseBody);
  }
}
