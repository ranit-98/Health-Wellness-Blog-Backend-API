import { sendError } from '../utils/response.utils';
import { Request, Response, NextFunction } from 'express';


interface AuthRequest extends Request {
  user?: any;
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    return sendError(res, 'Admin access required', 403);
  }

  next();
};