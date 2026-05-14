import { Injectable, signal } from '@angular/core';

import { ICategory } from '@models/category.model';

@Injectable()
export class CategoriesStoreService {
  private readonly _categories = signal<ICategory[]>([]);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isAddNewCategoryLoading = signal<boolean>(false);
  private readonly _isUpdateCategoryLoading = signal<boolean>(false);
  public readonly categories = this._categories.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly isAddNewCategoryLoading = this._isAddNewCategoryLoading.asReadonly();
  public readonly isUpdateCategoryLoading = this._isUpdateCategoryLoading.asReadonly();

  public setCategories(categories: ICategory[]): void {
    this._categories.set(categories);
  }

  public setLoading(isLoading: boolean): void {
    this._isLoading.set(isLoading);
  }

  public setAddNewCategoryLoading(isLoading: boolean): void {
    this._isAddNewCategoryLoading.set(isLoading);
  }

  public setUpdateCategoryLoading(isLoading: boolean): void {
    this._isUpdateCategoryLoading.set(isLoading);
  }
}
