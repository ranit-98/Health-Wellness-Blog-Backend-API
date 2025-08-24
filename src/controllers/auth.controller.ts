import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendError, sendSuccess } from '../utils/response.utils';


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return sendError(res, 'Name, email and password are required', 400);
      }

      const result = await this.authService.register({ name, email, password });
      return sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      const result = await this.authService.login(email, password);
      return sendSuccess(res, 'Login successful', result);
    } catch (error: any) {
      return sendError(res, error.message, 401);
    }
  };
}
