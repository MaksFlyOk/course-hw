import { InjectionToken } from '@angular/core';

import { IArticlesRepository } from '@services/articles/articles-repository.interface';

export const ARTICLES_REPOSITORY_TOKEN = new InjectionToken<IArticlesRepository>(
  '[ARTICLES_REPOSITORY_TOKEN]: сервис для управления списком статей',
);
