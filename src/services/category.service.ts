import { CategoryRepository } from '../repositories/category.repository';
import { ICategory } from '../types';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData: Partial<ICategory>) {
    const existingCategory = await this.categoryRepository.findByName(categoryData.name!);
    if (existingCategory) {
      throw new Error('Category already exists');
    }

    return await this.categoryRepository.create(categoryData);
  }

  async getAllCategories() {
    return await this.categoryRepository.findMany();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async updateCategory(id: string, updateData: Partial<ICategory>) {
    const category = await this.categoryRepository.updateById(id, updateData);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.deleteById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}
