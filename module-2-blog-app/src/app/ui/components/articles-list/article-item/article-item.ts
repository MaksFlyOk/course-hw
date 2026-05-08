import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { IArticle } from '@models/article.model';

@Component({
  selector: 'blog-app-article-item',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIcon, MatIconButton],
  templateUrl: './article-item.html',
  styleUrl: './article-item.scss',
})
export class ArticleItem {
  public readonly data = input.required<IArticle>();
  public readonly delete = output<string>();
  public readonly edit = output<string>();

  protected onDelete(): void {
    this.delete.emit(this.data().id);
  }

  protected onEdit(): void {
    this.edit.emit(this.data().id);
  }
}
