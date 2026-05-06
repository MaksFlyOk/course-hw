import { Routes } from '@angular/router';

import { ArticlePage } from '@pages/article-page/article-page';
import { BlogPage } from '@pages/blog-page/blog-page';
import { MainPage } from '@pages/main-page/main-page';

export const routes: Routes = [
  {
    path: '',
    component: MainPage,
    title: 'Главная',
  },
  {
    path: 'blog',
    children: [
      {
        path: '',
        component: BlogPage,
        title: 'Блог',
      },
      {
        path: ':id',
        component: ArticlePage,
        title: 'Статья',
      },
    ],
  },
];
