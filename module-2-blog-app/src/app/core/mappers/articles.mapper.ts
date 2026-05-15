import { Injectable, inject } from '@angular/core';

import { mockImg } from '@constants/mock.constant';
import { IArticle } from '@models/article.model';
import { IArticleApiResponse } from '@models/articles-api.model';

import { IENVconfig } from '../../../../environments/environments.interface';
import { ENV_CONFIG_TOKEN } from '../../../../environments/environments.token';

@Injectable()
export class ArticlesMapper {
  private readonly env = inject(ENV_CONFIG_TOKEN) as IENVconfig;

  public toArticle(raw: IArticleApiResponse): IArticle {
    return {
      ...raw,
      imgSrc: raw.imgSrc ? `${this.env.apiUrl}${raw.imgSrc}` : mockImg,
    };
  }

  public toArticles(items: IArticleApiResponse[]): IArticle[] {
    return items.map((item) => this.toArticle(item));
  }
}
