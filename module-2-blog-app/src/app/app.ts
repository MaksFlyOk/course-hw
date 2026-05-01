import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@components/layout/footer/footer';
import { Header } from '@components/layout/header/header';
import { ARTICLES_REPOSITORY_TOKEN } from '@core/services/articles/articles-repository.token';

@Component({
  selector: 'app-blog-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly articlesService = inject(ARTICLES_REPOSITORY_TOKEN);

  ngOnInit() {
    this.articlesService.loadArticles();
  }
}
