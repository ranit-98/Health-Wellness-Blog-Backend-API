import { Response } from 'express';
import { IResponse } from '@/types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: string
): Response => {
  const response: IResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(error && { error })
  };
  
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  return sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => {
  return sendResponse(res, statusCode, false, message, undefined, error);
};