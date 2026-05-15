import { Injectable, inject } from '@angular/core';

import { CategoriesApi } from '@core/api/categories/categories.api';
import { ICategory } from '@models/category.model';
import { ICategoriesRepository } from '@services/categories/categories-repository.interface';
import { CategoriesStoreService } from '@services/categories/categories-store.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CategoriesHttpRepository implements ICategoriesRepository {
  private readonly store = inject(CategoriesStoreService);
  private readonly api = inject(CategoriesApi);

  public async loadCategories() {
    this.store.setLoading(true);

    const categories = await lastValueFrom(this.api.getAll());

    this.store.setCategories(categories);
    this.store.setLoading(false);
  }

  public async addCategory(name: string): Promise<string> {
    const existing = this.store.categories().find((c) => c.name === name || c.id === name);

    if (existing) {
      return existing.id;
    }

    this.store.setAddNewCategoryLoading(true);

    const created = await lastValueFrom(this.api.create({ name }));

    this.store.setCategories([created, ...this.store.categories()]);
    this.store.setAddNewCategoryLoading(false);

    return created.id;
  }

  public async getCategoryByID(id: string): Promise<ICategory | undefined> {
    const fromStore = this.store.categories().find((c) => c.id === id);

    if (fromStore) {
      return fromStore;
    }

    const categories = await lastValueFrom(this.api.getAll());

    this.store.setCategories(categories);

    return categories.find((c) => c.id === id);
  }

  public async updateCategory(newCategoryName: string, categoryId: string): Promise<void> {
    const nameExists = this.store.categories().some((c) => c.name === newCategoryName && c.id !== categoryId);

    if (nameExists) {
      return;
    }

    this.store.setUpdateCategoryLoading(true);

    const updated = await lastValueFrom(this.api.update(categoryId, { name: newCategoryName }));

    this.store.setCategories(this.store.categories().map((c) => (c.id === categoryId ? updated : c)));
    this.store.setUpdateCategoryLoading(false);
  }

  public deleteCategory(id: string): void {
    const snapshot = this.store.categories();

    this.store.setCategories(snapshot.filter((c) => c.id !== id));

    this.api.remove(id).subscribe({
      error: () => {
        this.store.setCategories(snapshot);
      },
    });
  }
}
