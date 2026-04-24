import { Injectable, computed, effect, signal } from '@angular/core';

import { InitArticlesList, localStorageArticlesListKey } from '@core/constants';
import { simulateNetworkDelay } from '@core/utils/simulate-network-delay';
import { Article } from '@models/article.model';
import { AddArticleData } from '@pages/blog-page/article-from/article-data.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly _articles = signal<Article[]>([]);
  protected readonly _isLoading = signal(false);
  private readonly _isInitialized = signal(false);
  public readonly articles = this._articles.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly totalArticles = computed(() => this._articles().length);

  constructor() {
    void this.loadInitialData();

    effect(() => {
      if (!this._isInitialized()) return;
      localStorage.setItem(localStorageArticlesListKey, JSON.stringify(this._articles()));
    });
  }

  private async loadInitialData() {
    this._isLoading.set(true);

    await simulateNetworkDelay();

    const storageData = localStorage.getItem(localStorageArticlesListKey);
    if (storageData) {
      try {
        const parsedData = JSON.parse(storageData);

        this._articles.set(parsedData);
      } catch (e) {
        console.error('Ошибка парсинга LocalStorage', e);
        this._articles.set(InitArticlesList);
      }
    } else {
      this._articles.set(InitArticlesList);

      this.saveToStorage();
    }

    this._isLoading.set(false);
    this._isInitialized.set(true);
  }

  private saveToStorage(): void {
    localStorage.setItem(localStorageArticlesListKey, JSON.stringify(this._articles()));
  }

  private getRandomImage(): string {
    const idx = Math.floor(Math.random() * 7) + 1;
    return `images/blog/blog-img${idx}.webp`;
  }

  public addNewArticle(data: AddArticleData): void {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      image: this.getRandomImage(),
      date: new Date().toISOString().slice(0, 10),
    };

    this._articles.update((list) => [newArticle, ...list]);
    this.saveToStorage();
  }

  public getArticleById(id: string): Article | undefined {
    return this._articles().find((item) => item.id === id);
  }

  public updateArticle(newData: AddArticleData & { id: string }): void {
    this._articles.update((list) =>
      list.map((article) => (article.id === newData.id ? { ...article, ...newData } : article)),
    );

    this.saveToStorage();
  }

  public deleteArticle(id: string): void {
    this._articles.update((list) => list.filter((a) => a.id !== id));
    this.saveToStorage();
  }
}
