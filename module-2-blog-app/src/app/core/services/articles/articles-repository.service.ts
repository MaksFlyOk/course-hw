import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { InitArticlesList, delayConstant, localStorageArticlesListKey } from '@core/constants';
import { IArticlesRepository, IArticlesResult } from '@core/services/articles/articles-repository.interface';
import { ArticlesStoreService } from '@core/services/articles/articles-store.service';
import { Article } from '@models/article.model';
import { AddArticleData } from '@pages/blog-page/article-from/article-data.type';
import { Observable, concatMap, delay, of, tap } from 'rxjs';

const pageSize = 7;

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
        concatMap((page) => this.fetchArticles(page)),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.store.setLoading(false)),
      )
      .subscribe((res) => this.syncStore(res));
  }

  private fetchArticles(page: number): Observable<IArticlesResult> {
    return new Observable<IArticlesResult>((observer) => {
      const data = localStorage.getItem(localStorageArticlesListKey);
      const all: Article[] = data ? JSON.parse(data) : InitArticlesList;

      observer.next({
        items: all.slice((page - 1) * pageSize, page * pageSize),
        total: all.length,
        latest: all.slice(0, 2),
      });
      observer.complete();
    }).pipe(delay(delayConstant));
  }

  public addArticle(data: AddArticleData & { id: string }): void {
    this.modifyData((all) => {
      const newItem = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        image: `images/blog/blog-img${Math.floor(Math.random() * 7) + 1}.webp`,
      };
      return [newItem, ...all];
    }).subscribe((res) => this.syncStore(res));
  }

  public deleteArticle(id: string): void {
    this.modifyData((all) => all.filter((a) => a.id !== id)).subscribe((res) => this.syncStore(res));
  }

  public updateArticle(data: AddArticleData & { id: string }): void {
    this.modifyData((all) => all.map((a) => (a.id === data.id ? { ...a, ...data } : a))).subscribe((res) =>
      this.syncStore(res),
    );
  }

  private modifyData(modifier: (all: Article[]) => Article[]): Observable<IArticlesResult> {
    return of(null).pipe(
      tap(() => {
        const all = JSON.parse(localStorage.getItem(localStorageArticlesListKey) || '[]');
        localStorage.setItem(localStorageArticlesListKey, JSON.stringify(modifier(all)));
      }),
      concatMap(() => this.fetchArticles(this.store.currentPage())),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private syncStore(res: IArticlesResult): void {
    this.store.updateArticles(res.items);
    this.store.updateTotalArticles(res.total);
    this.store.updateQuantityPages(Math.ceil(res.total / pageSize));
    this.store.updateLastArticles(res.latest);
  }
}
