import { ApplicationConfig, ChangeDetectionStrategy } from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './shared/store/app.store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './shared/store/auth/auth.effects';
import { WebStorageService } from './shared/services/web-storage.service';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideSupabaseClient,
  provideCurrentUser,
  provideBookmarkSelect,
  provideSelectFilters,
  provideBookmarkNavElements,
  provideHeaderNavElements,
  provideImgUrl,
  provideBookmarkStatusList,
  provideDarkThemeLocalStorageKey,
  provideStorageKey,
  provideInitRootServices,
} from './providers';
import { SearchMovieEffects } from './shared/store/search-movie/search-movie.effects';
import { SearchTVEffects } from './shared/store/search-tv/search-tv.effects';
import { DiscoveryMovieEffects } from './shared/store/discovery-movie/discovery-movie.effects';
import { TitleStrategyService } from './shared/services/title-strategy.service';
import { MovieBookmarkEffects } from './shared/store/movie-bookmark/movie-bookmark.effects';
import { TVBookmarkEffects } from './shared/store/tv-bookmark/tv-bookmark.effects';
import { DiscoveryTVEffects } from './shared/store/discovery-tv/discovery-tv.effects';
import { BookmarkMetadataEffects } from './shared/store/bookmark-metadata/bookmark-metadata.effects';
import { FiltersMetadataEffects } from './shared/store/filters-metadata/filters-metadata.effects';

import { SearchPeopleEffects } from './shared/store/search-people/search-people.effects';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideStorageKey(),
    provideSupabaseClient(),
    provideInitRootServices(),
    provideCurrentUser(),
    provideBookmarkSelect(),
    provideSelectFilters(),
    provideAnimations(),
    provideImgUrl(),
    provideBookmarkNavElements(),
    provideHeaderNavElements(),
    provideBookmarkStatusList(),
    provideDarkThemeLocalStorageKey(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([])),
    provideRouter(
      routes,
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
      MovieBookmarkEffects,
      TVBookmarkEffects,
      BookmarkMetadataEffects,
      FiltersMetadataEffects,
      SearchPeopleEffects,
    ]),
    WebStorageService,
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService,
    },
  ],
};
