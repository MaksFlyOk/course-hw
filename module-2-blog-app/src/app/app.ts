import { Component, OnInit, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@components/layout/footer/footer';
import { Header } from '@components/layout/header/header';
import { ARTICLES_REPOSITORY_TOKEN } from '@services/articles/articles-repository.token';

@Component({
  selector: 'app-blog-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly articlesService = inject(ARTICLES_REPOSITORY_TOKEN);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    this.registerCustomIcons();
  }

  ngOnInit() {
    this.articlesService.loadArticles();
  }

  private registerCustomIcons(): void {
    this.iconRegistry.addSvgIcon(
      'blog-app-edit',
      this.sanitizer.bypassSecurityTrustResourceUrl('images/edit-article.svg'),
    );

    this.iconRegistry.addSvgIcon(
      'blog-app-delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('images/delete-article.svg'),
    );
  }
}
