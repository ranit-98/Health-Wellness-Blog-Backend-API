import { Request, Response } from 'express';
import { NewsletterService } from '../services/newsletter.service';
import { sendError, sendSuccess } from '../utils/response.utils';


export class NewsletterController {
  private newsletterService: NewsletterService;

  constructor() {
    this.newsletterService = new NewsletterService();
  }

  subscribe = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return sendError(res, 'Email is required', 400);
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(res, 'Invalid email format', 400);
      }

      await this.newsletterService.subscribe(email);
      return sendSuccess(res, 'Successfully subscribed to newsletter', null, 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  unsubscribe = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return sendError(res, 'Email is required', 400);
      }

      const result = await this.newsletterService.unsubscribe(email);
      return sendSuccess(res, result.message);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  getAllSubscribers = async (req: Request, res: Response) => {
    try {
      const subscribers = await this.newsletterService.getAllSubscribers();
      return sendSuccess(res, 'Subscribers retrieved successfully', subscribers);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };
}