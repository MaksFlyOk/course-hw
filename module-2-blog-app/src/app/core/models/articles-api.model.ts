export interface IArticleApiResponse {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly categoryId: string;
  readonly rating: number;
  readonly imgSrc?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface IArticlesPageApiResponse {
  readonly items: IArticleApiResponse[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}
