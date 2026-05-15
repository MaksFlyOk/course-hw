import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { articlesPageSize } from '@constants/page-sizes.constant';
import { delayConstant } from '@core/constants/delay.constant';
import { InitArticlesList } from '@core/constants/init-data.constant';
import { localStorageArticlesListKey } from '@core/constants/local-storage-keys.constant';
import { IArticlesRepository } from '@core/services/articles/articles-repository.interface';
import { ArticlesStoreService } from '@core/services/articles/articles-store.service';
import { IArticle } from '@models/article.model';
import { IArticlesResult } from '@models/articles-result.model';
import { IAddArticleData } from '@pages/blog-page/article-form/article-data.type';
import { Observable, concatMap, delay, of, switchMap, tap } from 'rxjs';

@Injectable()
export class ArticlesRepository implements IArticlesRepository {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(ArticlesStoreService);

  private readonly currentPage$ = toObservable(this.store.currentPage);

  public loadArticles(): void {
    if (this.store.articles().length > 0) return;

    this.handleReactivePageChange();
  }

  private handleReactivePageChange(): void {
    this.store.setLoading(true);

    this.currentPage$
      .pipe(
        switchMap((page) => this.fetchArticles(page)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.syncStore(res);
        this.store.setLoading(false);
      });
  }

  private fetchArticles(page: number): Observable<IArticlesResult> {
    return new Observable<IArticlesResult>((observer) => {
      const all = this.getAllArticlesFromStorage();

      observer.next({
        items: all.slice((page - 1) * articlesPageSize, page * articlesPageSize),
        total: all.length,
        latest: all.slice(0, 2),
      });
      observer.complete();
    }).pipe(delay(delayConstant));
  }

  public addArticle(data: IAddArticleData): void {
    this.modifyData((all) => {
      const now = new Date().toISOString();
      const newItem = {
        ...data,
        rating: 0,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      return [newItem, ...all];
    }).subscribe((res) => this.syncStore(res));
  }

  public deleteArticle(id: string): void {
    this.modifyData((all) => all.filter((a) => a.id !== id)).subscribe((res) => this.syncStore(res));
  }

  public updateArticle(data: IAddArticleData & { id: string }): void {
    this.modifyData((all) =>
      all.map((article) => {
        if (article.id === data.id) {
          const now = new Date().toISOString();

          return { ...article, ...data, updatedAt: now };
        }

        return article;
      }),
    ).subscribe((res) => this.syncStore(res));
  }

  private modifyData(modifier: (all: IArticle[]) => IArticle[]): Observable<IArticlesResult> {
    return of(null).pipe(
      tap(() => {
        const all = this.getAllArticlesFromStorage();
        localStorage.setItem(localStorageArticlesListKey, JSON.stringify(modifier(all)));
      }),
      concatMap(() => this.fetchArticles(this.store.currentPage())),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private getAllArticlesFromStorage(): IArticle[] {
    const data = localStorage.getItem(localStorageArticlesListKey);
    return data ? JSON.parse(data) : InitArticlesList;
  }

  private syncStore(res: IArticlesResult): void {
    this.store.updateArticles(res.items);
    this.store.updateTotalArticles(res.total);
    this.store.updateQuantityPages(Math.ceil(res.total / articlesPageSize));
    this.store.updateLastArticles(res.latest);
  }
}
