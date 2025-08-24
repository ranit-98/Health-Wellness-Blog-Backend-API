import { BaseRepository } from './base.repository';
import { Blog } from '../models/blog.model';

export class BlogRepository extends BaseRepository<any> {
  constructor() {
    super(Blog);
  }

  async findWithFilters(filters: any, options: any = {}) {
    const query: any = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return await this.model
      .find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(options.limit || 10)
      .skip(options.skip || 0);
  }

  async getRelatedBlogs(blogId: string, category: string, tags: string[], limit: number = 5) {
    return await this.model
      .find({
        _id: { $ne: blogId },
        $or: [
          { category },
          { tags: { $in: tags } }
        ]
      })
      .populate('authorId', 'name')
      .limit(limit)
      .sort({ createdAt: -1 });
  }
}