import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Button } from '@components/shared/button/button';
import { ButtonVariant } from '@components/shared/button/button.type';
import { Spinner } from '@components/shared/spinner/spinner';
import { ArticleService } from '@core/services/article-service/article-service';

@Component({
  selector: 'blog-app-last-articles',
  imports: [Button, Spinner, DatePipe],
  templateUrl: './last-articles.html',
  styleUrl: './last-articles.scss',
})
export class LastArticles {
  private readonly articleService = inject(ArticleService);
  protected router = inject(Router);

  protected readonly buttonVariant = ButtonVariant;
  protected readonly lastArticles = computed(() => this.articleService.articles().slice(0, 2));
  protected readonly isLoading = this.articleService.isLoading;
  protected readonly sectionTitle = computed(() => {
    const count = this.lastArticles().length;

    if (count === 0) return '';

    return count === 1 ? 'Последняя статья' : 'Последние статьи';
  });
}
