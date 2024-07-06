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
import { WebStorageService } from './shared/services/web-storage.service';
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
  provideI18E,
} from './providers';
import { SearchMovieEffects } from './shared/store/search-movie/search-movie.effects';

import { SearchTVEffects } from './shared/store/search-tv/search-tv.effects';
import { DiscoveryMovieEffects } from './shared/store/discovery-movie/discovery-movie.effects';
import { TitleStrategyService } from './shared/services/title-strategy.service';
import { MovieLifecycleEffects } from './shared/store/movie-lifecycle/movie-lifecycle.effects';
import { TVLifecycleEffects } from './shared/store/tv-lifecycle/tv-lifecycle.effects';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(),
    provideSupabaseClient(),
    provideAnimations(),
    provideTMDBApiKey(),
    provideTMDBBaseUrl(),
    provideImgUrl(),
    provideI18E(),
    provideHttpClient(withInterceptors([])),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideStore(reducers, { metaReducers }),
    provideEffects([
      AuthEffects,
      SearchMovieEffects,
      SearchTVEffects,
      DiscoveryMovieEffects,
      MovieLifecycleEffects,
      TVLifecycleEffects,
    ]),
    WebStorageService,
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService,
    },
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
