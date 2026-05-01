import { Component, input, output } from '@angular/core';

import { ArticleItem } from '@components/articles-list/article-item/article-item';
import { Button } from '@components/shared/button/button';
import { ButtonVariant } from '@components/shared/button/button.type';
import { Spinner } from '@components/shared/spinner/spinner';
import { Article } from '@models/article.model';

@Component({
  selector: 'blog-app-articles-list',
  standalone: true,
  imports: [ArticleItem, Spinner, Button],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  protected readonly buttonVariant = ButtonVariant.Outlined;
  public readonly articles = input.required<Article[]>();
  public readonly isLoading = input<boolean>(false);
  public readonly deleteArticle = output<string>();
  public readonly editArticle = output<string>();
}
