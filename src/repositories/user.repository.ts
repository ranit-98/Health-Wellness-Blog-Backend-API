import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';
import { IUser } from '@/types';

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email });
  }

  async addBookmark(userId: string, blogId: string) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarks: blogId } },
      { new: true }
    );
  }

  async removeBookmark(userId: string, blogId: string) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: blogId } },
      { new: true }
    );
  }

  async getBookmarks(userId: string) {
    return await this.model.findById(userId).populate('bookmarks');
  }
}
