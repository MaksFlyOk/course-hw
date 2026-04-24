import { Component, input, output } from '@angular/core';

import { localeDate } from '@core/utils/locale-date';
import { Article } from '@models/article.model';

@Component({
  selector: 'blog-app-article-item',
  standalone: true,
  imports: [],
  templateUrl: './article-item.html',
  styleUrl: './article-item.scss',
})
export class ArticleItem {
  public readonly data = input.required<Article>();
  public readonly delete = output<string>();
  public readonly edit = output<string>();
  protected readonly localeDate = localeDate;

  protected onDelete(): void {
    this.delete.emit(this.data().id);
  }

  protected onEdit(): void {
    this.edit.emit(this.data().id);
  }
}
