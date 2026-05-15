import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { articlesPageSize } from '@constants/page-sizes.constant';
import { ICreateArticleDto, IUpdateArticleDto } from '@core/api/articles/articles-dto';
import { ArticlesApi } from '@core/api/articles/articles.api';
import { ArticlesMapper } from '@core/mappers/articles.mapper';
import { IArticlesRepository } from '@core/services/articles/articles-repository.interface';
import { ArticlesStoreService } from '@core/services/articles/articles-store.service';
import { IArticlesPageApiResponse } from '@models/articles-api.model';
import { IArticlesResult } from '@models/articles-result.model';
import { IAddArticleData } from '@pages/blog-page/article-form/article-data.type';
import { EMPTY, Observable, catchError, forkJoin, switchMap } from 'rxjs';

@Injectable()
export class ArticlesHttpRepository implements IArticlesRepository {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(ArticlesStoreService);
  private readonly api = inject(ArticlesApi);
  private readonly mapper = inject(ArticlesMapper);

  private readonly currentPage$ = toObservable(this.store.currentPage);

  public loadArticles(): void {
    this.store.setLoading(true);

    this.currentPage$
      .pipe(
        switchMap((page) => this.fetchPageWithLatest(page)),
        catchError(() => {
          this.store.setLoading(false);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.syncStore(result);
        this.store.setLoading(false);
      });
  }

  public addArticle(data: IAddArticleData & { id: string }): void {
    const dto: ICreateArticleDto = {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      image: (data as IAddArticleData & { image?: File }).image,
    };

    this.mutate(() => this.api.create(dto));
  }

  public deleteArticle(id: string): void {
    this.mutate(() => this.api.remove(id));
  }

  public updateArticle(data: IAddArticleData & { id: string }): void {
    const dto: IUpdateArticleDto = {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
    };

    this.mutate(() => this.api.update(data.id, dto));
  }

  private mutate(operation: () => Observable<unknown>): void {
    operation()
      .pipe(
        switchMap(() => this.fetchPageWithLatest(this.store.currentPage())),
        catchError(() => {
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.syncStore(result);
      });
  }

  private fetchPageWithLatest(page: number): Observable<IArticlesResult> {
    if (page === 1) {
      return new Observable((observer) => {
        this.api
          .getAll(1, articlesPageSize)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              observer.next(this.toResult(res.items, res.total, res.items));
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
      });
    }

    return new Observable((observer) => {
      forkJoin({
        current: this.api.getAll(page, articlesPageSize),
        first: this.api.getAll(1, articlesPageSize),
      })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: ({ current, first }) => {
            observer.next(this.toResult(current.items, current.total, first.items));
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  private toResult(
    currentItems: IArticlesPageApiResponse['items'],
    total: number,
    latestItems: IArticlesPageApiResponse['items'],
  ): IArticlesResult {
    return {
      items: this.mapper.toArticles(currentItems),
      total,
      latest: this.mapper.toArticles(latestItems.slice(0, 2)),
    };
  }

  private syncStore(res: IArticlesResult): void {
    this.store.updateArticles(res.items);
    this.store.updateTotalArticles(res.total);
    this.store.updateQuantityPages(Math.ceil(res.total / articlesPageSize));
    this.store.updateLastArticles(res.latest);
  }
}
