import { IArticle } from '@models/article.model';
import { IAddArticleData } from '@pages/blog-page/article-from/article-data.type';

export interface IArticlesResult {
  items: IArticle[];
  total: number;
  latest: IArticle[];
}

export interface IArticlesRepository {
  loadArticles(): void;
  addArticle(article: IAddArticleData & { id: string }): void;
  deleteArticle(id: string): void;
  updateArticle(newArticle: IAddArticleData & { id: string }): void;
}
