import { IArticle } from '@models/article.model';

export interface IArticlesResult {
  items: IArticle[];
  total: number;
  latest: IArticle[];
}
