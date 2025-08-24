import { UserRepository } from '../repositories/user.repository';
import { BlogRepository } from '../repositories/blog.repository';

export class BookmarkService {
  private userRepository: UserRepository;
  private blogRepository: BlogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.blogRepository = new BlogRepository();
  }

  async addBookmark(userId: string, blogId: string) {
    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    const user = await this.userRepository.addBookmark(userId, blogId);
    return user;
  }

  async removeBookmark(userId: string, blogId: string) {
    const user = await this.userRepository.removeBookmark(userId, blogId);
    return user;
  }

  async getUserBookmarks(userId: string) {
    const user = await this.userRepository.getBookmarks(userId);
    return user?.bookmarks || [];
  }
}