import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Article } from '@models/article.model';

@Component({
  selector: 'blog-app-article-item',
  standalone: true,
  imports: [],
  templateUrl: './article-item.html',
  styleUrl: './article-item.scss',
})
export class ArticleItem {
  readonly data = input.required<Article>();
  readonly delete = output<string>();

  protected onDelete(): void {
    this.delete.emit(this.data().id);
  }
}
