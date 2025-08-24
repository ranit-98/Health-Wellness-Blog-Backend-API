import { sendError } from '../utils/response.utils';
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return sendError(res, "Validation Error", 400, messages.join(", "));
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return sendError(res, `${field} already exists`, 400);
  }

  if (error.name === "CastError") {
    return sendError(res, "Invalid ID format", 400);
  }

  return sendError(res, "Internal server error", 500, error.message);
};
