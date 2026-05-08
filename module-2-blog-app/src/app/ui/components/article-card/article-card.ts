import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { StarRating } from '@components/star-rating/star-rating';
import { IArticle } from '@models/article.model';

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
  ],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  public readonly article = input.required<IArticle | null>();
  public readonly updatedRating = output<number>();

  protected updateRating(rating: number) {
    this.updatedRating.emit(rating);
  }
}
