import { IComment } from '@models/comment.model';

export interface ICommentsResult {
  items: IComment[];
  total: number;
}
