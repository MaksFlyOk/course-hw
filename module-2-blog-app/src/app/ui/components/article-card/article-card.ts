import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

import { StarRating } from '@components/star-rating/star-rating';
import { CategoriesApi } from '@core/api/categories/categories.api';
import { IArticle } from '@models/article.model';
import { ICategory } from '@models/category.model';
import { CategoriesHttpRepository } from '@services/categories/categories-http-repository.service';
import { CategoriesRepository } from '@services/categories/categories-repository.service';
import { CATEGORIES_REPOSITORY_TOKEN } from '@services/categories/categories-repository.token';
import { CategoriesStoreService } from '@services/categories/categories-store.service';

import { IENVconfig } from '../../../../environments/environments.interface';
import { ENV_CONFIG_TOKEN } from '../../../../environments/environments.token';

@Component({
  selector: 'blog-app-article-card',
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardImage,
    MatCardTitle,
    MatIcon,
    StarRating,
    DatePipe,
    MatBadgeModule,
    MatButtonModule,
    MatIcon,
    RouterLink,
    DatePipe,
    MatCardSubtitle,
    MatProgressBar,
  ],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  providers: [
    CategoriesApi,
    CategoriesStoreService,
    CategoriesRepository,
    CategoriesHttpRepository,
    {
      provide: CATEGORIES_REPOSITORY_TOKEN,
      useFactory: (env: IENVconfig) => {
        return env.useLocalStorageService ? inject(CategoriesRepository) : inject(CategoriesHttpRepository);
      },
      deps: [ENV_CONFIG_TOKEN],
    },
  ],
})
export class ArticleCard implements OnInit {
  private readonly categoriesService = inject(CATEGORIES_REPOSITORY_TOKEN);

  protected readonly category = signal<ICategory | null>(null);
  protected readonly isCategoryError = signal<boolean>(false);
  public readonly article = input.required<IArticle | null>();
  public readonly updatedRating = output<number>();

  async ngOnInit() {
    const article = this.article();

    if (!article) {
      this.isCategoryError.set(true);
    } else {
      const category = await this.categoriesService.getCategoryByID(article.categoryId);

      if (category) {
        this.category.set(category);
      } else {
        this.isCategoryError.set(true);
      }
    }
  }

  protected updateRating(rating: number) {
    this.updatedRating.emit(rating);
  }
}
