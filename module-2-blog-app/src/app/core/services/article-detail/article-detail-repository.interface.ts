export interface IArticleDetailRepository {
  loadArticleDetails(id: string): void;
  addComment(content: string, author: string): void;
  updateCommentRating(commentId: string, newRating: number): void;
  updateArticleRating(newRating: number): void;
  setCommentPage(page: number): void;
}
