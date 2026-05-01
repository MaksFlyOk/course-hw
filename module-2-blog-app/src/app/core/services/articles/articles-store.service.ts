import { Injectable, signal } from '@angular/core';

import { Article } from '@models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesStoreService {
  private readonly _articles = signal<Article[]>([]);
  private readonly _lastArticles = signal<Article[]>([]);
  private readonly _totalArticles = signal(0);
  private readonly _currentPage = signal(1);
  private readonly _quantityPages = signal(1);
  private readonly _isLoading = signal(true);
  public readonly articles = this._articles.asReadonly();
  public readonly lastArticles = this._lastArticles.asReadonly();
  public readonly totalArticles = this._totalArticles.asReadonly();
  public readonly quantityPages = this._quantityPages.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  public updateArticles(items: Article[]): void {
    this._articles.set(items);
  }

  public updateLastArticles(lastArticles: Article[]): void {
    this._lastArticles.set(lastArticles);
  }

  public updateTotalArticles(total: number): void {
    this._totalArticles.set(total);
  }

  public updateQuantityPages(quantity: number): void {
    this._quantityPages.set(quantity);
  }

  public updatePage(page: number): void {
    this._currentPage.set(page);
  }

  public setLoading(value: boolean): void {
    this._isLoading.set(value);
  }

  public getArticleById(id: string): Article | undefined {
    return this._articles().find((article) => article.id === id);
  }
}
