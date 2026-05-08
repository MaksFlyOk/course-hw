import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { delayConstant } from '@core/constants/delay.constant';
import { InitArticlesCommentsList, InitArticlesList } from '@core/constants/init-data.constant';
import {
  localStorageArticlesCommentsListKey,
  localStorageArticlesListKey,
} from '@core/constants/local-storage-keys.constant';
import { IArticleDetailRepository } from '@core/services/article-detail/article-detail-repository.interface';
import { ArticleDetailStoreService } from '@core/services/article-detail/article-detail-store.service';
import { simulateNetworkDelay } from '@core/utils/simulate-network-delay';
import { IArticle } from '@models/article.model';
import { IComment } from '@models/comment.model';
import { ICommentsResult } from '@models/comments-result.model';
import { ICommentStorage } from '@models/comments-storage.model';
import { Observable, delay, of, switchMap } from 'rxjs';

const pageSize = 5;

@Injectable()
export class ArticleDetailsRepository implements IArticleDetailRepository {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(ArticleDetailStoreService);

  private readonly currentCommentPage$ = toObservable(this.store.currentCommentPage);

  public async loadArticleDetails(id: string) {
    this.store.setLoading(true);

    const currentArticle = this.getStorage<IArticle[]>(localStorageArticlesListKey, InitArticlesList).find(
      (article) => article.id === id,
    );

    await simulateNetworkDelay();

    if (!currentArticle) {
      this.store.setLoading(false);
      return;
    }

    this.store.setArticle(currentArticle);

    this.currentCommentPage$
      .pipe(
        switchMap((page) => {
          this.store.setIsCommentsLoading(true);
          return this.fetchComments(id, page);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        if (this.store.currentCommentPage() === 1) {
          this.store.setComments(res.items);
        } else {
          this.store.appendComments(res.items);
        }
        this.store.setTotalComments(res.total);
        this.store.setIsCommentsLoading(false);
        this.store.setLoading(false);
      });
  }

  public setCommentPage(page: number) {
    if (this.store.isCommentsLoading() || this.store.comments().length >= this.store.totalComments()) {
      return;
    }

    this.store.updateCommentsPage(page);
  }

  private fetchComments(articleId: string, page: number): Observable<ICommentsResult> {
    return of(null).pipe(
      delay(delayConstant),
      switchMap(() => {
        const storage = this.getStorage<ICommentStorage>(localStorageArticlesCommentsListKey, InitArticlesCommentsList);
        const articleComments = storage[articleId] || [];

        return of({
          items: articleComments.slice((page - 1) * pageSize, page * pageSize),
          total: articleComments.length,
        });
      }),
    );
  }

  public addComment(content: string, author: string): void {
    const article = this.store.article();
    if (!article) {
      return;
    }

    const newComment: IComment = {
      id: crypto.randomUUID(),
      articleId: article.id,
      author,
      content,
      date: new Date().toISOString().slice(0, 10),
      rating: 0,
    };

    const storage = this.getStorage<ICommentStorage>(localStorageArticlesCommentsListKey, InitArticlesCommentsList);
    storage[article.id] = [newComment, ...(storage[article.id] || [])];
    localStorage.setItem(localStorageArticlesCommentsListKey, JSON.stringify(storage));

    this.store.setComments([newComment, ...this.store.comments()]);
  }

  public updateCommentRating(commentId: string, newRating: number): void {
    const articleId = this.store.article()?.id;

    if (!articleId) {
      return;
    }

    const storage = this.getStorage<ICommentStorage>(localStorageArticlesCommentsListKey, InitArticlesCommentsList);

    if (storage[articleId]) {
      storage[articleId] = storage[articleId].map((comment) =>
        comment.id === commentId ? { ...comment, rating: newRating } : comment,
      );
      localStorage.setItem(localStorageArticlesCommentsListKey, JSON.stringify(storage));
    }

    this.store.setComments(
      this.store.comments().map((comment) => (comment.id === commentId ? { ...comment, rating: newRating } : comment)),
    );
  }

  public updateArticleRating(newRating: number): void {
    const article = this.store.article();

    if (!article) {
      return;
    }

    const all = this.getStorage<IArticle[]>(localStorageArticlesListKey, InitArticlesList);
    const updatedAll = all.map((articles) =>
      articles.id === article.id ? { ...articles, rating: newRating } : articles,
    );
    localStorage.setItem(localStorageArticlesListKey, JSON.stringify(updatedAll));

    this.store.setArticle({ ...article, rating: newRating });
  }

  private modifyComments(articleId: string, modifier: (all: IComment[]) => IComment[]): void {
    const storage = this.getStorage<ICommentStorage>(localStorageArticlesCommentsListKey, InitArticlesCommentsList);
    const articleComments = storage[articleId] || [];

    storage[articleId] = modifier(articleComments);
    localStorage.setItem(localStorageArticlesCommentsListKey, JSON.stringify(storage));

    this.setCommentPage(this.store.currentCommentPage());
  }

  private getStorage<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : defaultValue;
  }
}
