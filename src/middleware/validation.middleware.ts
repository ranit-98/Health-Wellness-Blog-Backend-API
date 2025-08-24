import { sendError } from '../utils/response.utils';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';


export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return sendError(res, 'Validation failed', 400, errorMessages.join(', '));
  }
  next();
};

// Validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

export const blogValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  validateRequest
];

export const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  validateRequest
];

export const emailValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  validateRequest
];
