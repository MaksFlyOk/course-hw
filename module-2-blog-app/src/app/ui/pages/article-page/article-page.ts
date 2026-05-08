import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ArticleCard } from '@components/article-card/article-card';
import { RatingData } from '@components/comments-list/comment/rating-data.type';
import { CommentsList } from '@components/comments-list/comments-list';
import { Spinner } from '@components/shared/spinner/spinner';
import { ArticleDetailsRepository } from '@core/services/article-detail/article-detail-repository.service';
import { ARTICLE_DETAIL_REPOSITORY_TOKEN } from '@core/services/article-detail/article-detail-repository.token';
import { ArticleDetailStoreService } from '@core/services/article-detail/article-detail-store.service';
import { IAddCommentData } from '@pages/article-page/comment-form/comment-data.type';
import { CommentForm } from '@pages/article-page/comment-form/comment-form';

@Component({
  selector: 'blog-app-article-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ArticleCard,
    CommentsList,
    Spinner,
    CommentForm,
  ],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  providers: [
    ArticleDetailStoreService,
    {
      provide: ARTICLE_DETAIL_REPOSITORY_TOKEN,
      useClass: ArticleDetailsRepository,
    },
  ],
})
export class ArticlePage implements OnInit {
  private readonly store = inject(ArticleDetailStoreService);
  private readonly repository = inject(ARTICLE_DETAIL_REPOSITORY_TOKEN);

  protected readonly id = input.required<string>();
  public readonly article = this.store.article;
  public readonly comments = this.store.comments;
  public readonly isLoading = this.store.isLoading;
  public readonly isCommentLoading = this.store.isCommentsLoading;
  public readonly totalComments = this.store.totalComments;

  ngOnInit() {
    if (this.id()) {
      this.repository.loadArticleDetails(this.id());
    }
  }

  protected onScrollLoad() {
    this.repository.setCommentPage(this.store.currentCommentPage() + 1);
  }

  protected updateArticleRating(newRating: number) {
    console.log(newRating);
    this.repository.updateArticleRating(newRating);
  }

  protected updateCommentRating(event: RatingData) {
    console.log(event);
    this.repository.updateCommentRating(event.id, event.rating);
  }

  protected addComment(data: IAddCommentData) {
    this.repository.addComment(data.content, data.author);
  }
}
