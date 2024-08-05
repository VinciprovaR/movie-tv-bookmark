import { ApplicationConfig } from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
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
  provideSupabaseClient,
  provideTMDBApiKey,
  provideTMDBBaseUrl,
  provideCurrentUser,
  provideLifecycleSelect,
  provideSelectFilters,
  provideLifecycleNavElements,
  provideHeaderNavElements,
  provideImgUrl,
  provideLifecycleStatusList,
  provideDarkThemeLocalStorageKey,
} from './providers';
import { SearchMovieEffects } from './shared/store/search-movie/search-movie.effects';

import { SearchTVEffects } from './shared/store/search-tv/search-tv.effects';
import { DiscoveryMovieEffects } from './shared/store/discovery-movie/discovery-movie.effects';
import { TitleStrategyService } from './shared/services/title-strategy.service';
import { MovieLifecycleEffects } from './shared/store/movie-lifecycle/movie-lifecycle.effects';
import { TVLifecycleEffects } from './shared/store/tv-lifecycle/tv-lifecycle.effects';
import { DiscoveryTVEffects } from './shared/store/discovery-tv/discovery-tv.effects';
import { LifecycleMetadataEffects } from './shared/store/lifecycle-metadata/lifecycle-metadata.effects';
import { FiltersMetadataEffects } from './shared/store/filters-metadata/filters-metadata.effects';
import { ErrorInterceptor } from './shared/interceptors/ErrorInterceptor.interceptor';
import { SearchPeopleEffects } from './shared/store/search-people/search-people.effects';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideCurrentUser(),
    provideLifecycleSelect(),
    provideSelectFilters(),
    provideSupabaseClient(),
    provideAnimations(),
    provideTMDBApiKey(),
    provideTMDBBaseUrl(),
    provideImgUrl(),

    provideLifecycleNavElements(),
    provideHeaderNavElements(),
    provideLifecycleStatusList(),
    provideDarkThemeLocalStorageKey(),
    provideHttpClient(withInterceptors([])),
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideStore(reducers, { metaReducers }),
    provideEffects([
      AuthEffects,
      SearchMovieEffects,
      SearchTVEffects,
      DiscoveryMovieEffects,
      DiscoveryTVEffects,
      MovieLifecycleEffects,
      TVLifecycleEffects,
      LifecycleMetadataEffects,
      FiltersMetadataEffects,
      SearchPeopleEffects,
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
