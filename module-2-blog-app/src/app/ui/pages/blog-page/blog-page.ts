import { ChangeDetectionStrategy, Component, inject, input, signal, viewChild } from '@angular/core';

import { ArticlesList } from '@components/articles-list/articles-list';
import { Modal } from '@components/modal/modal';
import { Button } from '@components/shared/button/button';
import { ButtonVariant } from '@components/shared/button/button.type';
import { ArticleService } from '@core/services/article-service/article-service';
import { Article } from '@models/article.model';
import { AddArticleData } from '@pages/blog-page/article-from/article-data.type';
import { ArticleFormVariants } from '@pages/blog-page/article-from/article-form-variants';
import { ArticleForm } from '@pages/blog-page/article-from/article-from';

@Component({
  selector: 'blog-app-blog-page',
  imports: [Modal, ArticleForm, ArticlesList, Button],
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
  protected readonly articleForm = viewChild.required<ArticleForm>('articleForm');
  protected readonly editArticleData = signal<Article | undefined>(undefined);
  protected isStatModalOpen = false;

  protected openStatModal(): void {
    this.isStatModalOpen = true;
  }

  protected closeStatModal(): void {
    this.isStatModalOpen = false;
  }

  protected handleFormSubmit(data: AddArticleData): void {
    if (this.editArticleData()) {
      this.articleService.updateArticle(data);
    } else {
      this.articleService.addNewArticle(data);
    }
  }

  protected deleteArticle(id: string): void {
    this.articleService.deleteArticle(id);
  }

  protected addArticleForm(): void {
    this.articleForm().toggleForm(ArticleFormVariants.Add);
    this.editArticleData.set(undefined);
  }

  protected editArticle(id: string): void {
    this.editArticleData.set(this.articleService.getArticleById(id));
    this.articleForm().toggleForm(ArticleFormVariants.Edit, id);
  }
}
