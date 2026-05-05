import { Component, HostListener, input, output, signal } from '@angular/core';

import { ArticleItem } from '@components/articles-list/article-item/article-item';
import { Button } from '@components/shared/button/button';
import { ButtonVariant } from '@components/shared/button/button.type';
import { Spinner } from '@components/shared/spinner/spinner';
import { IArticle } from '@models/article.model';

@Component({
  selector: 'blog-app-articles-list',
  standalone: true,
  imports: [ArticleItem, Spinner, Button],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  protected readonly buttonVariant = ButtonVariant.Outlined;
  protected isMobile = signal(window.innerWidth < 850);
  public readonly articles = input.required<IArticle[]>();
  public readonly page = input.required<number>();
  public readonly quantityPages = input.required<number>();
  public readonly isLoading = input<boolean>(false);
  public readonly deleteArticle = output<string>();
  public readonly editArticle = output<string>();
  public readonly nextButtonCallback = output<void>();
  public readonly prevButtonCallback = output<void>();

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 850);
  }
}
