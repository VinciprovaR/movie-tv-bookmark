import { ApplicationConfig } from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './shared/store/app.store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './shared/store/auth/auth.effects';
import { WebStorageService, TitleStrategyService } from './shared/services';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  provideAppInitializer,
  provideSupabaseClient,
  provideTMDBApiKey,
  provideTMDBBaseUrl,
  provideImgUrl,
  provideLifecycleEnum,
} from './providers';
import { SearchMovieEffects } from './shared/store/search-movie/search-movie.effects';
import { LifecycleEnumEffects } from './shared/store/lifecycle-enum/lifecycle.effects';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(),
    provideSupabaseClient(),
    provideAnimations(),
    provideTMDBApiKey(),
    provideTMDBBaseUrl(),
    provideImgUrl(),
    provideLifecycleEnum(),
    provideHttpClient(withInterceptors([])),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideStore(reducers, { metaReducers }),
    provideEffects([AuthEffects, SearchMovieEffects, LifecycleEnumEffects]),
    WebStorageService,
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService,
    },
    provideNzI18n(en_US),
    provideAnimationsAsync(),
  ],
};
