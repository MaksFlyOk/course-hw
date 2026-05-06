import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'blog-app-star-rating',
  standalone: true,
  imports: [MatIcon, MatTooltip, MatIconButton],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  public readonly rating = model<number>(0);
  public readonly starCount = input<number>(5);
  public readonly color = input<string>('accent');
  public readonly ratingUpdated = output<number>();
  protected ratingArr = computed(() => Array.from({ length: this.starCount() }, (_, i) => i));

  onClick(index: number) {
    const newRating = index + 1;
    const finalRating = this.rating() === newRating ? 0 : newRating;

    this.rating.set(finalRating);
    this.ratingUpdated.emit(finalRating);
  }

  protected getIcon(index: number): string {
    return this.rating() >= index + 1 ? 'star' : 'star_border';
  }
}
