export interface ICreateArticleDto {
  readonly title: string;
  readonly content: string;
  readonly categoryId: string;
  readonly image?: File;
}

export interface IUpdateArticleDto {
  readonly title: string;
  readonly content: string;
  readonly categoryId: string;
}
