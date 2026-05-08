import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { RatingData } from '@components/comments-list/comment/rating-data.type';
import { Rating } from '@components/rating/rating';
import { InitialsPipe } from '@core/pipes/initials/initials-pipe';
import { IComment } from '@models/comment.model';

@Component({
  selector: 'blog-app-comment',
  imports: [
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    DatePipe,
    Rating,
    InitialsPipe,
    MatIcon,
  ],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment {
  public readonly comment = input.required<IComment>();
  public readonly ratingUpdated = output<RatingData>();

  protected updateRating(newRating: number) {
    this.ratingUpdated.emit({ id: this.comment().id, rating: newRating });
  }
}
