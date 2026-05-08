import { InjectionToken } from '@angular/core';

import { IArticleDetailRepository } from '@core/services/article-detail/article-detail-repository.interface';

export const ARTICLE_DETAIL_REPOSITORY_TOKEN = new InjectionToken<IArticleDetailRepository>(
  '[ARTICLE_DETAIL_REPOSITORY_TOKEN]: сервис для управления конкретной статьей и её комментариями',
);
