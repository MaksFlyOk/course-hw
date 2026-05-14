import { ICategory } from '@models/category.model';

export interface ICategoriesRepository {
  loadCategories(): Promise<void>;
  addCategory(categoryName: string): Promise<string>;
  getCategoryByID(id: string): Promise<ICategory | undefined>;
  deleteCategory(id: string): void;
  updateCategory(newCategoryName: string, categoryId: string): Promise<void>;
}
