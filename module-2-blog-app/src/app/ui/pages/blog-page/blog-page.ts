import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';

import { ArticlesList } from '@components/articles-list/articles-list';
import { Modal } from '@components/modal/modal';
import { InitArticlesList, localStorageArticlesListKey } from '@core/constants';
import { Article } from '@models/article.model';
import { AddArticleData } from '@pages/blog-page/add-article-from/add-article-data.type';
import { AddArticleForm } from '@pages/blog-page/add-article-from/add-article-from';

@Component({
  selector: 'blog-app-blog-page',
  imports: [Modal, AddArticleForm, ArticlesList],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPage implements OnInit {
  protected readonly articles = signal<Article[]>([]);
  protected readonly isLoading = signal(false);
  protected isStatModalOpen = false;

  protected readonly totalArticles = computed(() => this.articles().length);

  ngOnInit(): void {
    this.initArticles();
  }

  private async initArticles(): Promise<void> {
    this.isLoading.set(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storageData = localStorage.getItem(localStorageArticlesListKey);

    if (storageData) {
      try {
        const parsedData = JSON.parse(storageData);
        this.articles.set(parsedData);
      } catch (e) {
        console.error('Ошибка парсинга LocalStorage', e);
        this.articles.set(InitArticlesList);
      }
    } else {
      this.articles.set(InitArticlesList);

      this.saveToStorage();
    }

    this.isLoading.set(false);
  }

  private saveToStorage(): void {
    localStorage.setItem(localStorageArticlesListKey, JSON.stringify(this.articles()));
  }

  protected addNewArticle(data: AddArticleData): void {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.content,
      image: this.getRandomImage(),
      date: new Date().toISOString().slice(0, 10),
    };

    this.articles.update((list) => [newArticle, ...list]);
    this.saveToStorage();
  }

  protected deleteArticle(id: string): void {
    this.articles.update((list) => list.filter((a) => a.id !== id));
    this.saveToStorage();
  }

  private getRandomImage(): string {
    const idx = Math.floor(Math.random() * 7) + 1;
    return `images/blog/blog-img${idx}.webp`;
  }

  protected openStatModal(): void {
    this.isStatModalOpen = true;
  }
  protected closeStatModal(): void {
    this.isStatModalOpen = false;
  }
}
