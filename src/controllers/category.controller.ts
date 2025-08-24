import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { sendError, sendSuccess } from '../utils/response.utils';


export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return sendError(res, 'Category name is required', 400);
      }

      const category = await this.categoryService.createCategory({ name, description });
      return sendSuccess(res, 'Category created successfully', category, 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return sendSuccess(res, 'Categories retrieved successfully', categories);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);
      return sendSuccess(res, 'Category retrieved successfully', category);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const category = await this.categoryService.updateCategory(id, updateData);
      return sendSuccess(res, 'Category updated successfully', category);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      return sendSuccess(res, 'Category deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };
}
