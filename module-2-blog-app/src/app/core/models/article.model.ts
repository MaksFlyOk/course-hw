export interface IArticle {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly imgSrc: string;
  readonly categoryId: string;
  readonly rating: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
