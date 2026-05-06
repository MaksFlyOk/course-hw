import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'blog-app-article-page',
  imports: [],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage {
  protected readonly id = input.required<string>();

  constructor() {
    effect(() => {
      console.log('Article id: ' + this.id());
    });
  }
}
