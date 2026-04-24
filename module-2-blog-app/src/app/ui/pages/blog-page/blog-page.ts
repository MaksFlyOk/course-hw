import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { ArticlesList } from '@components/articles-list/articles-list';
import { Modal } from '@components/modal/modal';
import { Button } from '@components/shared/button/button';
import { ButtonVariant } from '@components/shared/button/button.type';
import { ArticleService } from '@core/services/article-service/article-service';
import { AddArticleData } from '@pages/blog-page/add-article-from/add-article-data.type';
import { AddArticleForm } from '@pages/blog-page/add-article-from/add-article-from';

@Component({
  selector: 'blog-app-blog-page',
  imports: [Modal, AddArticleForm, ArticlesList, Button],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPage {
  private readonly articleService = inject(ArticleService);
  protected readonly articles = this.articleService.articles;
  protected readonly isLoading = this.articleService.isLoading;
  protected readonly totalArticles = this.articleService.totalArticles;
  protected readonly buttonVariant = ButtonVariant.Outlined;
  protected isStatModalOpen = false;

  protected openStatModal(): void {
    this.isStatModalOpen = true;
  }

  protected closeStatModal(): void {
    this.isStatModalOpen = false;
  }

  protected addNewArticle(data: AddArticleData): void {
    this.articleService.addNewArticle(data);
  }

  protected deleteArticle(id: string): void {
    this.articleService.deleteArticle(id);
  }
}
