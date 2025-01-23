import {
  APP_INITIALIZER,
  inject,
  InjectionToken,
  provideAppInitializer,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { GlobalErrorStore } from './core/component-store/global-error-store.service';
import { NotifierStore } from './core/component-store/notifier-store.service';
import { AuthActions } from './core/store/auth';
import { BookmarkMetadataActions } from './core/store/bookmark-metadata';
import { FiltersMetadataActions } from './core/store/filters-metadata';
import { SupabaseAuthEventsService } from './services/supabase-auth-events.service';
import {
  BookmarkNavElement,
  NavElements,
} from './shared/interfaces/navigator.interface';
import { BookmarkStatusMap } from './shared/interfaces/supabase/supabase-bookmark.interface';
import { ToggleThemeService } from './services/toggle-theme.service';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>(
  'supabase-client'
);

const STORAGE_KEY = 'sb-movie-tv-bookmark-auth-token';

export const STORAGE_KEY_TOKEN = new InjectionToken<string>(
  'STORAGE_KEY_TOKEN'
);

export const IMG_SIZES = {
  TMDB_BACKDROP_ORIGINAL_IMG_URL: new InjectionToken<string>(
    'TMDB_BACKDROP_ORIGINAL_IMG_URL'
  ),
  TMDB_EVAL_COLOR_92W_IMG_URL: new InjectionToken<string>(
    'TMDB_EVAL_COLOR_92W_IMG_URL'
  ),
  TMDB_PROFILE_132W_132H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_132W_132H_IMG_URL'
  ),
  TMDB_PROFILE_W_185_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_W_185_IMG_URL'
  ),
  TMDB_PROFILE_H_632_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_H_632_IMG_URL'
  ),
  TMDB_POSTER_W_342_IMG_URL: new InjectionToken<string>(
    'TMDB_POSTER_W_342_IMG_URL'
  ),
  TMDB_POSTER_W_780_IMG_URL: new InjectionToken<string>(
    'TMDB_POSTER_W_780_IMG_URL'
  ),

  TMDB_BACKDROP_W_300_IMG_URL: new InjectionToken<string>(
    'TMDB_BACKDROP_W_300_IMG_URL'
  ),
  TMDB_BACKDROP_W_1280_IMG_URL: new InjectionToken<string>(
    'TMDB_BACKDROP_W_1280_IMG_URL'
  ),
  TMDB_POSTER_W_520_H_900_SMART_IMG_URL: new InjectionToken<string>(
    'TMDB_POSTER_W_520_H_900_SMART_IMG_URL'
  ),
};

export const LIFECYCLE_NAV_ELEMENTS = new InjectionToken<BookmarkNavElement[]>(
  'LIFECYCLE_NAV_ELEMENTS'
);

export const HEADER_NAV_ELEMENTS = new InjectionToken<NavElements>(
  'HEADER_NAV_ELEMENTS'
);

export const LIFECYCLE_STATUS_MAP = new InjectionToken<BookmarkStatusMap>(
  'LIFECYCLE_STATUS_MAP'
);
export const THEME_KEY_LOCAL_STORAGE = new InjectionToken<string>(
  'THEME_KEY_LOCAL_STORAGE'
);

export function provideStorageKey() {
  return [
    {
      provide: STORAGE_KEY_TOKEN,
      useValue: STORAGE_KEY,
    },
  ];
}

export function provideSupabaseClient() {
  return {
    provide: SUPABASE_CLIENT,
    useFactory: () =>
      createClient(
        'https://fahpcnjaykumnjwfmkdy.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaHBjbmpheWt1bW5qd2Zta2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMjYzOTUsImV4cCI6MjAzMzYwMjM5NX0.wq98GdUuiqA1e_9aYJlQC1TKyoLeRdh_IP2mALY7mCc',
        { auth: { storageKey: STORAGE_KEY } }
      ),
  };
}

export function provideInitRootServices() {
  return provideAppInitializer(() => {
    inject(SupabaseAuthEventsService);
    inject(GlobalErrorStore);
    inject(NotifierStore);
    inject(ToggleThemeService);
    const store = inject(Store);
    store.dispatch(AuthActions.currentUser());
    store.dispatch(BookmarkMetadataActions.retriveBookmarkMetadata());
    store.dispatch(FiltersMetadataActions.getFiltersMetadata());
  });
}

export function provideImgUrl() {
  const endPointMedia = 'https://media.themoviedb.org/';
  return [
    {
      provide: IMG_SIZES.TMDB_BACKDROP_ORIGINAL_IMG_URL,
      useValue: `${endPointMedia}t/p/original`,
    },
    {
      provide: IMG_SIZES.TMDB_EVAL_COLOR_92W_IMG_URL,
      useValue: `${endPointMedia}t/p/w92`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_132W_132H_IMG_URL,
      useValue: `${endPointMedia}t/p/w132_and_h132_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_POSTER_W_342_IMG_URL,
      useValue: `${endPointMedia}t/p/w342`,
    },
    {
      provide: IMG_SIZES.TMDB_POSTER_W_780_IMG_URL,
      useValue: `${endPointMedia}t/p/w780`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_W_185_IMG_URL,
      useValue: `${endPointMedia}t/p/w185`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_H_632_IMG_URL,
      useValue: `${endPointMedia}t/p/h632`,
    },
    {
      provide: IMG_SIZES.TMDB_BACKDROP_W_300_IMG_URL,
      useValue: `${endPointMedia}t/p/w300`,
    },
    {
      provide: IMG_SIZES.TMDB_BACKDROP_W_1280_IMG_URL,
      useValue: `${endPointMedia}t/p/w1280`,
    },
    {
      provide: IMG_SIZES.TMDB_POSTER_W_520_H_900_SMART_IMG_URL,
      useValue: `${endPointMedia}t/p/w520_and_h900_smart`,
    },
  ];
}

export function provideDarkThemeLocalStorageKey() {
  return {
    provide: THEME_KEY_LOCAL_STORAGE,
    useValue: 'darkTheme',
  };
}

export function provideBookmarkNavElements() {
  return {
    provide: LIFECYCLE_NAV_ELEMENTS,
    useValue: [
      { label: 'Watchlist', path: 'watchlist' },
      { label: 'Watched', path: 'watched' },
      { label: 'Rewatch', path: 'rewatch' },
      { label: 'Watching', path: 'watching' },
    ],
  };
}

export function provideHeaderNavElements() {
  return {
    provide: HEADER_NAV_ELEMENTS,
    useValue: {
      a_search: {
        single: true,
        label: 'Search',
        paths: ['/media-search'],
        needAuth: false,
      },
      b_discovery: {
        single: true,
        label: 'Discovery',
        paths: ['/media-discovery'],
        needAuth: false,
      },
      c_bookmark: {
        single: true,
        label: 'Bookmarks',
        paths: ['/media-bookmark'],
        needAuth: false,
      },
      d_ai: {
        single: true,
        label: 'AI',
        paths: ['/ask'],
        needAuth: false,
      },
      e_profile: {
        single: false,
        label: 'Profile',
        paths: ['/settings', '/logout'],
        subMenu: [
          { label: 'Settings', path: 'settings', needAuth: true },
          { label: 'Sign Out', path: 'logout', needAuth: true },
        ],
        needAuth: true,
      },
      e_signIn: {
        single: true,
        label: 'Sign In',
        paths: ['/login'],
        needAuth: false,
        onlyNonAuth: true,
      },
    },
  };
}
