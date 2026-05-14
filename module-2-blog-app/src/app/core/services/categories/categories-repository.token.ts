import { InjectionToken } from '@angular/core';

import { ICategoriesRepository } from '@services/categories/categories-repository.interface';

export const CATEGORIES_REPOSITORY_TOKEN = new InjectionToken<ICategoriesRepository>(
  '[CATEGORY_REPOSITORY_TOKEN]: сервис для управления категориями',
);
