import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendError, sendSuccess } from '../utils/response.utils';


export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getDashboard = async (req: Request, res: Response) => {
    try {
      const dashboardData = await this.adminService.getDashboardStats();
      return sendSuccess(res, 'Dashboard data retrieved successfully', dashboardData);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.adminService.getAllUsers(
        parseInt(page as string),
        parseInt(limit as string)
      );
      return sendSuccess(res, 'Users retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  updateUserRole = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!role || !['user', 'admin'].includes(role)) {
        return sendError(res, 'Valid role (user or admin) is required', 400);
      }

      const user = await this.adminService.updateUserRole(userId, role);
      return sendSuccess(res, 'User role updated successfully', user);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      await this.adminService.deleteUser(userId);
      return sendSuccess(res, 'User deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  getAllBlogsForAdmin = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.adminService.getAllBlogsForAdmin(
        parseInt(page as string),
        parseInt(limit as string)
      );
      return sendSuccess(res, 'Blogs retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };
}