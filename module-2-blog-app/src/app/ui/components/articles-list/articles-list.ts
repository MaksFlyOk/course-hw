import { Component, input, output } from '@angular/core';

import { ArticleItem } from '@components/articles-list/article-item/article-item';
import { Spinner } from '@components/shared/spinner/spinner';
import { Article } from '@models/article.model';

@Component({
  selector: 'blog-app-articles-list',
  standalone: true,
  imports: [ArticleItem, Spinner],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  readonly articles = input.required<Article[]>();
  readonly isLoading = input<boolean>(false);
  readonly deleteArticle = output<string>();
}
