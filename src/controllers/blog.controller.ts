import { Request, Response } from 'express';
import { BlogService } from '../services/blog.service';
import { sendError, sendSuccess } from '../utils/response.utils';


interface AuthRequest extends Request {
  user?: any;
}

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  createBlog = async (req: AuthRequest, res: Response) => {
    try {
      const { title, content, coverImage, category, tags } = req.body;
      
      if (!title || !content || !category) {
        return sendError(res, 'Title, content and category are required', 400);
      }

      const blogData = {
        title,
        content,
        coverImage,
        category,
        tags: tags || [],
        authorId: req.user.userId
      };

      const blog = await this.blogService.createBlog(blogData);
      return sendSuccess(res, 'Blog created successfully', blog, 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getAllBlogs = async (req: Request, res: Response) => {
    try {
      const { category, tags, search, page = 1, limit = 10 } = req.query;
      
      const filters: any = {};
      if (category) filters.category = category;
      if (tags) filters.tags = (tags as string).split(',');
      if (search) filters.search = search;

      const result = await this.blogService.getAllBlogs(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      return sendSuccess(res, 'Blogs retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getBlogById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.blogService.getBlogById(id);
      return sendSuccess(res, 'Blog retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  updateBlog = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const blog = await this.blogService.updateBlog(id, updateData);
      return sendSuccess(res, 'Blog updated successfully', blog);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  deleteBlog = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.blogService.deleteBlog(id);
      return sendSuccess(res, 'Blog deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  getBlogsByCategory = async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.blogService.getBlogsByCategory(
        category,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      return sendSuccess(res, 'Blogs retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  searchBlogs = async (req: Request, res: Response) => {
    try {
      const { q: query, page = 1, limit = 10 } = req.query;
      
      if (!query) {
        return sendError(res, 'Search query is required', 400);
      }

      const result = await this.blogService.searchBlogs(
        query as string,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      return sendSuccess(res, 'Search results retrieved successfully', result);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };
}