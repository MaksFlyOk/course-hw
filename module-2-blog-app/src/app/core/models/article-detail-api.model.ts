export interface IArticleDetailApiResponse {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly categoryId: string;
  readonly rating: number;
  readonly imgSrc?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ICommentApiResponse {
  readonly id: string;
  readonly articleId: string;
  readonly username: string;
  readonly content: string;
  readonly rating: number;
  readonly createdAt: string;
}
