import { IComment } from '@models/comment.model';

export interface ICommentStorage {
  [articleId: string]: IComment[];
}
