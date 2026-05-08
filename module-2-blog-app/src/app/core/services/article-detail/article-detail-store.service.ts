import { Injectable, signal } from '@angular/core';

import { IArticle } from '@models/article.model';
import { IComment } from '@models/comment.model';

@Injectable()
export class ArticleDetailStoreService {
  private readonly _article = signal<IArticle | null>(null);
  private readonly _comments = signal<IComment[]>([]);
  private readonly _totalComments = signal<number>(0);
  private readonly _currentCommentPage = signal<number>(1);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isCommentsLoading = signal<boolean>(false);
  public readonly article = this._article.asReadonly();
  public readonly comments = this._comments.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly totalComments = this._totalComments.asReadonly();
  public readonly currentCommentPage = this._currentCommentPage.asReadonly();
  public readonly isCommentsLoading = this._isCommentsLoading.asReadonly();

  public setArticle(article: IArticle | null): void {
    this._article.set(article);
  }

  public setComments(comments: IComment[]): void {
    this._comments.set(comments);
  }

  public appendComments(comments: IComment[]): void {
    this._comments.update((current) => [...current, ...comments]);
  }

  public setTotalComments(totalComments: number): void {
    this._totalComments.set(totalComments);
  }

  public updateCommentsPage(commentsPage: number): void {
    this._currentCommentPage.set(commentsPage);
  }

  public setLoading(isLoading: boolean): void {
    this._isLoading.set(isLoading);
  }

  public setIsCommentsLoading(isLoading: boolean): void {
    this._isCommentsLoading.set(isLoading);
  }
}
