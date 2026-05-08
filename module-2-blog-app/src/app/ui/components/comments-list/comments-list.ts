import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

import { Comment } from '@components/comments-list/comment/comment';
import { RatingData } from '@components/comments-list/comment/rating-data.type';
import { IComment } from '@models/comment.model';

@Component({
  selector: 'blog-app-comments-list',
  imports: [Comment, MatProgressBar],
  templateUrl: './comments-list.html',
  styleUrl: './comments-list.scss',
})
export class CommentsList implements AfterViewInit {
  public readonly comments = input.required<IComment[]>();
  public readonly isCommentsLoading = input.required<boolean>();
  public readonly totalComments = input.required<number>();
  public readonly ratingUpdated = output<RatingData>();
  public readonly loadMore = output<void>();

  private readonly scrollTrigger = viewChild<ElementRef>('scrollTrigger');

  ngAfterViewInit() {
    this.initIntersectionObserver();
  }

  private initIntersectionObserver(): void {
    const scrollTrigger = this.scrollTrigger();

    if (scrollTrigger) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.isCommentsLoading()) {
            this.loadMore.emit();
          }
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        },
      );

      observer.observe(scrollTrigger.nativeElement);
    }
  }

  protected updateRating(event: RatingData) {
    this.ratingUpdated.emit(event);
  }
}
