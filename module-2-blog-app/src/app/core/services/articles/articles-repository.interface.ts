import { Article } from '@models/article.model';
import { AddArticleData } from '@pages/blog-page/article-from/article-data.type';

export interface IArticlesResult {
  items: Article[];
  total: number;
  latest: Article[];
}

export interface IArticlesRepository {
  loadArticles(): void;
  addArticle(article: AddArticleData & { id: string }): void;
  deleteArticle(id: string): void;
  updateArticle(newArticle: AddArticleData & { id: string }): void;
}
