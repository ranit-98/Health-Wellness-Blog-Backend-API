import { BaseRepository } from './base.repository';
import { Category } from '../models/category.model';

export class CategoryRepository extends BaseRepository<any> {
  constructor() {
    super(Category);
  }

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }
}