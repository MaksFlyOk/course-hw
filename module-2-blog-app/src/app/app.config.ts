import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { ArticlesApi } from '@core/api/articles/articles.api';
import { ArticlesMapper } from '@core/mappers/articles.mapper';
import { ArticlesHttpRepository } from '@services/articles/articles-http-repository.service';
import { ArticlesRepository } from '@services/articles/articles-repository.service';
import { ARTICLES_REPOSITORY_TOKEN } from '@services/articles/articles-repository.token';

import { environment } from '../environments/environment';
import { ENV_CONFIG_TOKEN } from '../environments/environments.token';
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
    { provide: ENV_CONFIG_TOKEN, useValue: environment },
    ArticlesMapper,
    ArticlesApi,
    {
      provide: ARTICLES_REPOSITORY_TOKEN,
      useClass: environment.useLocalStorageService ? ArticlesRepository : ArticlesHttpRepository,
    },
  ],
};
