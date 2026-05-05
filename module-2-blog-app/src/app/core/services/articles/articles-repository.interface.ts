import { IAddArticleData } from '@pages/blog-page/article-from/article-data.type';

export interface IArticlesRepository {
  loadArticles(): void;
  addArticle(article: IAddArticleData & { id: string }): void;
  deleteArticle(id: string): void;
  updateArticle(newArticle: IAddArticleData & { id: string }): void;
}
