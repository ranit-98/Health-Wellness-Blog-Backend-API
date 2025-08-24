import { BlogRepository } from '../repositories/blog.repository';
import { UserRepository } from '../repositories/user.repository';
import { IBlog } from '@/types';

export class BlogService {
  private blogRepository: BlogRepository;
  private userRepository: UserRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
    this.userRepository = new UserRepository();
  }

  async createBlog(blogData: Partial<IBlog>) {
    const blog = await this.blogRepository.create(blogData);
    const author = blog.authorId
      ? await this.userRepository.findById(blog.authorId)
      : null;

    return {
      ...blog.toObject?.() || blog,
      author: author ? { name: author.name, email: author.email } : null,
    };
  }

  async getAllBlogs(filters: any = {}, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const blogs = await this.blogRepository.findWithFilters(filters, { limit, skip });
    const total = await this.blogRepository.count(filters);

    // attach author info manually
    const blogsWithAuthor = await Promise.all(
      blogs.map(async (blog) => {
        const author = blog.authorId
          ? await this.userRepository.findById(blog.authorId)
          : null;

        return {
          ...blog.toObject?.() || blog,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return {
      blogs: blogsWithAuthor,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogById(id: string) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }

    const author = blog.authorId
      ? await this.userRepository.findById(blog.authorId)
      : null;

    const relatedBlogs = await this.blogRepository.getRelatedBlogs(
      id,
      blog.category,
      blog.tags,
      5
    );

    return {
      blog: {
        ...blog.toObject?.() || blog,
        author: author ? { name: author.name, email: author.email } : null,
      },
      relatedBlogs,
    };
  }

  async updateBlog(id: string, updateData: Partial<IBlog>) {
    const blog = await this.blogRepository.updateById(id, updateData);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }

  async deleteBlog(id: string) {
    const blog = await this.blogRepository.deleteById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }

  async getBlogsByCategory(category: string, page: number = 1, limit: number = 10) {
    return await this.getAllBlogs({ category }, page, limit);
  }

  async searchBlogs(query: string, page: number = 1, limit: number = 10) {
    return await this.getAllBlogs({ search: query }, page, limit);
  }
}
