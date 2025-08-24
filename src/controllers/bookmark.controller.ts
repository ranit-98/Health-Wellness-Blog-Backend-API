import { Request, Response } from 'express';
import { BookmarkService } from '../services/bookmark.service';
import { sendError, sendSuccess } from '../utils/response.utils';


interface AuthRequest extends Request {
  user?: any;
}

export class BookmarkController {
  private bookmarkService: BookmarkService;

  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  addBookmark = async (req: AuthRequest, res: Response) => {
    try {
      const { blogId } = req.body;
      
      if (!blogId) {
        return sendError(res, 'Blog ID is required', 400);
      }

      await this.bookmarkService.addBookmark(req.user.userId, blogId);
      return sendSuccess(res, 'Blog bookmarked successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  removeBookmark = async (req: AuthRequest, res: Response) => {
    try {
      const { blogId } = req.params;
      
      await this.bookmarkService.removeBookmark(req.user.userId, blogId);
      return sendSuccess(res, 'Bookmark removed successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  getUserBookmarks = async (req: AuthRequest, res: Response) => {
    try {
      const bookmarks = await this.bookmarkService.getUserBookmarks(req.user.userId);
      return sendSuccess(res, 'Bookmarks retrieved successfully', bookmarks);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };
}
