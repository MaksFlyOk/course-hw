import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { ArticlesRepository } from '@services/articles/articles-repository.service';
import { ARTICLES_REPOSITORY_TOKEN } from '@services/articles/articles-repository.token';

import { routes } from './app.routes';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    { provide: LOCALE_ID, useValue: 'ru-RU' },
    { provide: ARTICLES_REPOSITORY_TOKEN, useClass: ArticlesRepository },
  ],
};
