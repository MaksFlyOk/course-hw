export interface ICreateArticleDto {
  title: string;
  content: string;
  categoryId: string;
  image?: File;
}

export interface IUpdateArticleDto {
  title: string;
  content: string;
  categoryId: string;
}
