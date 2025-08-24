import { UserRepository } from '../repositories/user.repository';
import { BlogRepository } from '../repositories/blog.repository';
import { SubscriberRepository } from '../repositories/subscriber.repository';
import { CategoryRepository } from '../repositories/category.repository';

export class AdminService {
  private userRepository: UserRepository;
  private blogRepository: BlogRepository;
  private subscriberRepository: SubscriberRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.blogRepository = new BlogRepository();
    this.subscriberRepository = new SubscriberRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getDashboardStats() {
    const [totalUsers, totalBlogs, totalSubscribers, totalCategories] = await Promise.all([
      this.userRepository.count({ role: 'user' }),
      this.blogRepository.count(),
      this.subscriberRepository.count(),
      this.categoryRepository.count()
    ]);

    // Get recent activities
    const recentBlogs = await this.blogRepository.findMany(
      {},
      { limit: 5, sort: { createdAt: -1 }, populate: 'authorId' }
    );

    const recentUsers = await this.userRepository.findMany(
      { role: 'user' },
      { limit: 5, sort: { createdAt: -1 } }
    );

    return {
      stats: {
        totalUsers,
        totalBlogs,
        totalSubscribers,
        totalCategories
      },
      recentActivities: {
        recentBlogs,
        recentUsers
      }
    };
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userRepository.findMany(
      {},
      { limit, skip, sort: { createdAt: -1 } }
    );
    const total = await this.userRepository.count();

    return {
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        bookmarksCount: user.bookmarks?.length || 0
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateUserRole(userId: string, role: 'user' | 'admin') {
    const user = await this.userRepository.updateById(userId, { role });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.deleteById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllBlogsForAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const blogs = await this.blogRepository.findMany(
      {},
      { limit, skip, sort: { createdAt: -1 }, populate: 'authorId' }
    );
    const total = await this.blogRepository.count();

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
