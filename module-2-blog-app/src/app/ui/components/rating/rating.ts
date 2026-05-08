import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'blog-app-rating',
  imports: [MatIconButton, MatIcon],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  public readonly value = input.required<number>();
  public readonly ratingChanged = output<number>();

  protected updateRating(newValue: number): void {
    const result = this.value() === newValue ? 0 : newValue;
    this.ratingChanged.emit(result);
  }
}
