import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';

import { ArticlesList } from '@components/articles-list/articles-list';
import { SideMenu } from '@components/side-menu/side-menu';
import { ARTICLES_REPOSITORY_TOKEN } from '@core/services/articles/articles-repository.token';
import { ArticlesStoreService } from '@core/services/articles/articles-store.service';
import { Article } from '@models/article.model';
import { SideMenuButton } from '@models/side-menu-buttons.model';
import { AddArticleData } from '@pages/blog-page/article-from/article-data.type';
import { ArticleFormVariants } from '@pages/blog-page/article-from/article-form-variants';
import { ArticleForm } from '@pages/blog-page/article-from/article-from';
import { BlogHeader } from '@pages/blog-page/blog-header/blog-header';
import { StatModal } from '@pages/blog-page/stat-modal/stat-modal';

@Component({
  selector: 'blog-app-blog-page',
  imports: [ArticleForm, ArticlesList, StatModal, BlogHeader, SideMenu],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPage {
  private readonly articlesService = inject(ARTICLES_REPOSITORY_TOKEN);
  private readonly articlesStore = inject(ArticlesStoreService);

  protected readonly articles = this.articlesStore.articles;
  protected readonly isLoading = this.articlesStore.isLoading;
  protected readonly currentPage = this.articlesStore.currentPage;
  protected readonly quantityPages = this.articlesStore.quantityPages;
  protected readonly totalArticles = this.articlesStore.totalArticles;
  protected readonly articleForm = viewChild.required<ArticleForm>('articleForm');
  protected readonly editArticleData = signal<Article | undefined>(undefined);
  protected readonly sideMenuButtons: SideMenuButton[] = [
    {
      buttonTitle: 'Создать статью',
      callback: () => this.addArticleForm(),
      img: { src: 'images/post-add.webp', alt: 'Добавить статью' },
    },
    {
      buttonTitle: 'Показать статистику статей',
      callback: () => this.openStatModal(),
      img: { src: 'images/stats.webp', alt: 'Открыть статистику статей' },
    },
  ];

  private readonly statModal = viewChild.required(StatModal);

  protected openStatModal(): void {
    this.statModal()?.openStatModal();
  }

  protected handleFormSubmit(data: AddArticleData & { id: string }): void {
    if (this.editArticleData()) {
      this.articlesService.updateArticle(data);
    } else {
      this.articlesService.addArticle(data);
    }
  }

  protected deleteArticle(id: string): void {
    if (this.editArticleData()?.id === id) {
      this.articleForm().toggleForm(ArticleFormVariants.Edit, id);
      this.editArticleData.set(undefined);
    }

    this.articlesService.deleteArticle(id);
  }

  protected addArticleForm(): void {
    this.articleForm().toggleForm(ArticleFormVariants.Add);
    this.editArticleData.set(undefined);
  }

  protected editArticle(id: string): void {
    this.editArticleData.set(this.articlesStore.getArticleById(id));
    this.articleForm().toggleForm(ArticleFormVariants.Edit, id);
  }

  protected prevButtonCallback(): void {
    this.articlesStore.updatePage(this.articlesStore.currentPage() - 1);
  }

  protected nextButtonCallback(): void {
    this.articlesStore.updatePage(this.articlesStore.currentPage() + 1);
  }
}
