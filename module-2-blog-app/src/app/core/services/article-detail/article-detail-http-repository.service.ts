import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { commentsPageSize } from '@constants/page-sizes.constant';
import { ArticleDetailApi } from '@core/api/article-detail/article-detail.api';
import { ArticlesMapper } from '@core/mappers/articles.mapper';
import { IArticleDetailRepository } from '@services/article-detail/article-detail-repository.interface';
import { ArticleDetailStoreService } from '@services/article-detail/article-detail-store.service';
import { EMPTY, catchError, concatMap, from, lastValueFrom, switchMap } from 'rxjs';

@Injectable()
export class ArticleDetailHttpRepository implements IArticleDetailRepository {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(ArticleDetailStoreService);
  private readonly api = inject(ArticleDetailApi);
  private readonly mapper = inject(ArticlesMapper);

  private readonly currentCommentPage$ = toObservable(this.store.currentCommentPage);

  public async loadArticleDetails(id: string): Promise<void> {
    this.store.setLoading(true);

    const article = await lastValueFrom(this.api.getArticle(id).pipe(catchError(() => EMPTY))).catch(() => null);

    if (!article) {
      this.store.setLoading(false);

      return;
    }

    this.store.setArticle(this.mapper.toArticle(article));

    this.currentCommentPage$
      .pipe(
        switchMap((page) => {
          this.store.setIsCommentsLoading(true);

          return this.api.getComments(id, page, commentsPageSize).pipe(
            catchError(() => {
              this.store.setIsCommentsLoading(false);

              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        if (this.store.currentCommentPage() === 1) {
          this.store.setComments(res);
        } else {
          this.store.appendComments(res);
        }

        this.store.setTotalComments(res.length);
        this.store.setIsCommentsLoading(false);
        this.store.setLoading(false);
      });
  }

  public setCommentPage(page: number): void {
    if (this.store.isCommentsLoading() || this.store.comments().length >= this.store.totalComments()) {
      return;
    }

    this.store.updateCommentsPage(page);
  }

  public async addComment(content: string, username: string): Promise<void> {
    const article = this.store.article();

    if (!article) {
      return;
    }

    this.store.setIsCommentsAddingLoading(true);

    const created = await lastValueFrom(
      this.api.createComment({ username, content, articleId: article.id }).pipe(catchError(() => EMPTY)),
    ).catch(() => null);

    if (!created) {
      this.store.setIsCommentsAddingLoading(false);

      return;
    }

    this.store.setComments([created, ...this.store.comments()]);
    this.store.setTotalComments(this.store.totalComments() + 1);
    this.store.setIsCommentsAddingLoading(false);
  }

  public updateCommentRating(commentId: string, newRating: number): void {
    const snapshot = this.store.comments();

    this.store.setComments(snapshot.map((c) => (c.id === commentId ? { ...c, rating: newRating } : c)));

    this.api
      .updateCommentRating(commentId, { rating: newRating })
      .pipe(
        catchError(() => {
          this.store.setComments(snapshot);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public updateArticleRating(newRating: number): void {
    const article = this.store.article();

    if (!article) {
      return;
    }

    const snapshot = article;
    const diff = newRating - article.rating;
    const steps = Math.abs(diff);
    const request$ = diff > 0 ? this.api.ratingUp(article.id) : this.api.ratingDown(article.id);

    this.store.setArticle({ ...article, rating: newRating });

    // Думаю это далеко не лучшее решение, но чтобы не изменять компонент и подстроится под BE ничего другого в голову не пришло
    from(Array.from({ length: steps }))
      .pipe(
        concatMap(() => request$),
        catchError(() => {
          this.store.setArticle(snapshot);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        if (updated) {
          this.store.setArticle(this.mapper.toArticle(updated));
        }
      });
  }
}
