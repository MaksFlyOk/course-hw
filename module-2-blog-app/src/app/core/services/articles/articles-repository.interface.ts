import { IAddArticleData } from '@pages/blog-page/article-form/article-data.type';

export interface IArticlesRepository {
  loadArticles(): void;
  addArticle(article: IAddArticleData): void;
  deleteArticle(id: string): void;
  updateArticle(newArticle: IAddArticleData & { id: string }): void;
}
