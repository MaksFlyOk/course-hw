import { Injectable, inject } from '@angular/core';

import { InitCategoriesList } from '@constants/init-data.constant';
import { localStorageCategoriesListKey } from '@constants/local-storage-keys.constant';
import { ICategory } from '@models/category.model';
import { ICategoriesRepository } from '@services/categories/categories-repository.interface';
import { CategoriesStoreService } from '@services/categories/categories-store.service';
import { simulateNetworkDelay } from '@utils/simulate-network-delay';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  private readonly store = inject(CategoriesStoreService);

  public async loadCategories() {
    this.store.setLoading(true);

    const categories = this.getStorage();

    await simulateNetworkDelay();

    this.store.setCategories(categories);
    this.store.setLoading(false);
  }

  public async addCategory(name: string): Promise<string> {
    this.store.setAddNewCategoryLoading(true);

    const category = this.store.categories().find((category) => category.name === name || category.id === name);

    if (category) {
      return category.id;
    }

    await simulateNetworkDelay();

    const newCategory: ICategory = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCategoriesList = [newCategory, ...this.store.categories()];

    this.modifyData(newCategoriesList);
    this.store.setAddNewCategoryLoading(false);

    return newCategory.id;
  }

  public async getCategoryByID(id: string): Promise<ICategory | undefined> {
    const category = this.getStorage().find((category) => category.id === id);

    await simulateNetworkDelay();

    return category;
  }

  public async updateCategory(newCategoryName: string, categoryId: string) {
    const nameExists = this.store
      .categories()
      .some((category) => category.name === newCategoryName && category.id !== categoryId);

    if (nameExists) {
      return;
    }

    this.store.setUpdateCategoryLoading(true);

    await simulateNetworkDelay();

    const newCategoriesList = this.store
      .categories()
      .map((category) =>
        category.id === categoryId
          ? { ...category, name: newCategoryName, updatedAt: new Date().toISOString() }
          : category,
      );

    this.modifyData(newCategoriesList);
    this.store.setUpdateCategoryLoading(false);
  }

  public deleteCategory(id: string): void {
    const newCategoriesList = this.store.categories().filter((category) => category.id !== id);

    this.modifyData(newCategoriesList);
  }

  private getStorage(): ICategory[] {
    const data = localStorage.getItem(localStorageCategoriesListKey);

    return data ? JSON.parse(data) : InitCategoriesList;
  }

  private modifyData(newCategoriesList: ICategory[]): void {
    this.store.setCategories(newCategoriesList);
    localStorage.setItem(localStorageCategoriesListKey, JSON.stringify(newCategoriesList));
  }
}
