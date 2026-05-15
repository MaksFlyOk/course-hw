export interface ICreateCommentDto {
  readonly username: string;
  readonly content: string;
  readonly articleId: string;
}

export interface IUpdateCommentRatingDto {
  readonly rating: number;
}
