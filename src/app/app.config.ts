import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { metaReducers, reducers } from './core/store/app.store';
import { AuthEffects } from './core/store/auth/auth.effects';
import { BookmarkMetadataEffects } from './core/store/bookmark-metadata/bookmark-metadata.effects';
import { DiscoveryMovieEffects } from './core/store/discovery-movie/discovery-movie.effects';
import { DiscoveryTVEffects } from './core/store/discovery-tv/discovery-tv.effects';
import { FiltersMetadataEffects } from './core/store/filters-metadata/filters-metadata.effects';
import { MovieBookmarkEffects } from './core/store/movie-bookmark/movie-bookmark.effects';
import { SearchMovieEffects } from './core/store/search-movie/search-movie.effects';
import { SearchPeopleEffects } from './core/store/search-people/search-people.effects';
import { SearchTVEffects } from './core/store/search-tv/search-tv.effects';
import { TVBookmarkEffects } from './core/store/tv-bookmark/tv-bookmark.effects';
import {
  provideBookmarkNavElements,
  provideBookmarkSelect,
  provideBookmarkStatusList,
  provideCurrentUser,
  provideDarkThemeLocalStorageKey,
  provideHeaderNavElements,
  provideImgUrl,
  provideInitRootServices,
  provideSelectFilters,
  provideStorageKey,
  provideSupabaseClient,
} from './providers';
import { TitleStrategyService } from './services/title-strategy.service';
import { WebStorageService } from './services/web-storage.service';
import { AskAiEffects } from './core/store/ask-ai/ask-ai.effects';

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
      AskAiEffects,
    ]),
    WebStorageService,
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService,
    },
  ],
};
