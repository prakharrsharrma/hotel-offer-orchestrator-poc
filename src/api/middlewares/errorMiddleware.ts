import type { NextFunction, Request, Response } from "express";

type ErrorWithStatusCode = Error & {
  statusCode?: number;
};

export const errorMiddleware = (
  error: ErrorWithStatusCode,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    message: error.message || "Internal server error",
  });
};
