export interface IArticleDetailApiResponse {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  rating: number;
  imgSrc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentApiResponse {
  id: string;
  articleId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}
