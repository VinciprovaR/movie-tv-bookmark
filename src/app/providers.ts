import { APP_INITIALIZER, InjectionToken } from '@angular/core';
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
  TMDB_ORIGINAL_IMG_URL: new InjectionToken<string>('TMDB_ORIGINAL_IMG_URL'),
  TMDB_PROFILE_300W_450H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_300W_450H_IMG_URL'
  ),
  TMDB_PROFILE_600W_900H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_600W_900H_IMG_URL'
  ),
  W_780_IMG_URL: new InjectionToken<string>('W_780_IMG_URL'),
  W_500_IMG_URL: new InjectionToken<string>('W_500_IMG_URL'),
  TMDB_PROFILE_440W_660H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_440W_660H_IMG_URL'
  ),
  TMDB_PROFILE_260W_390H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_260W_390H_IMG_URL'
  ),
  TMDB_PROFILE_1000W_450H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_1000W_450H_IMG_URL'
  ),
  TMDB_PROFILE_1920W_800H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_1920W_800H_IMG_URL'
  ),

  TMDB_W_400_IMG_URL: new InjectionToken<string>('TMDB_W_400_IMG_URL'),
  TMDB_W_300_IMG_URL: new InjectionToken<string>('TMDB_W_300_IMG_URL'),

  TMDB_PROFILE_92W_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_92W_IMG_URL'
  ),
  TMDB_PROFILE_66W_66H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_66W_66H_IMG_URL'
  ),
  TMDB_PROFILE_132W_132H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_132W_132H_IMG_URL'
  ),
  TMDB_PROFILE_1920W_1080H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_1920W_1080H_IMG_URL'
  ),
  TMDB_PROFILE_138W_175H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_138W_175H_IMG_URL'
  ),
  TMDB_PROFILE_276W_350H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_1920W_1080H_IMG_URL'
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
  return {
    provide: APP_INITIALIZER,
    useFactory:
      (
        a: SupabaseAuthEventsService,
        b: GlobalErrorStore,
        c: NotifierStore,
        d: ToggleThemeService
      ) =>
      () => {},
    deps: [
      SupabaseAuthEventsService,
      GlobalErrorStore,
      NotifierStore,
      ToggleThemeService,
    ],
    multi: true,
  };
}

export function provideImgUrl() {
  const endPointMedia = 'https://media.themoviedb.org/';
  return [
    {
      provide: IMG_SIZES.TMDB_ORIGINAL_IMG_URL,
      useValue: `${endPointMedia}t/p/original`,
    },
    {
      provide: IMG_SIZES.W_780_IMG_URL,
      useValue: `${endPointMedia}t/p/w780`,
    },
    {
      provide: IMG_SIZES.W_500_IMG_URL,
      useValue: `${endPointMedia}t/p/w500`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_300W_450H_IMG_URL,
      useValue: `${endPointMedia}t/p/w300_and_h450_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_600W_900H_IMG_URL,
      useValue: `${endPointMedia}t/p/w600_and_h900_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_440W_660H_IMG_URL,
      useValue: `${endPointMedia}t/p/w440_and_h660_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_260W_390H_IMG_URL,
      useValue: `${endPointMedia}t/p/w260_and_h390_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1920W_800H_IMG_URL,
      useValue: `${endPointMedia}t/p/w1920_and_h800_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1000W_450H_IMG_URL,
      useValue: `${endPointMedia}t/p/w1000_and_h450_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_W_300_IMG_URL,
      useValue: `${endPointMedia}t/p/w300`,
    },
    {
      provide: IMG_SIZES.TMDB_W_400_IMG_URL,
      useValue: `${endPointMedia}t/p/w400`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_92W_IMG_URL,
      useValue: `${endPointMedia}t/p/w92`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_66W_66H_IMG_URL,
      useValue: `${endPointMedia}t/p/w66_and_h66_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_132W_132H_IMG_URL,
      useValue: `${endPointMedia}t/p/w132_and_h132_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1920W_1080H_IMG_URL,
      useValue: `${endPointMedia}t/p/w1920_and_h1080_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_138W_175H_IMG_URL,
      useValue: `${endPointMedia}t/p/w138_and_h175_bestv2`,
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_276W_350H_IMG_URL,
      useValue: `${endPointMedia}t/p/w276_and_h350_bestv2`,
    },
  ];
}

export function provideCurrentUser() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () => {
      store.dispatch(AuthActions.currentUser());
    },
    deps: [Store],
    multi: true,
  };
}

export function provideBookmarkSelect() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () => {
      store.dispatch(BookmarkMetadataActions.retriveBookmarkMetadata());
    },
    deps: [Store],
    multi: true,
  };
}

export function provideSelectFilters() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () => {
      store.dispatch(FiltersMetadataActions.getFiltersMetadata());
    },
    deps: [Store],
    multi: true,
  };
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
      a_movie: {
        single: false,
        label: 'Movie',
        paths: ['/movie', '/discovery-movie', '/movie-bookmark-search'],
        subMenu: [
          { label: 'Search', path: 'movie', needAuth: false },
          { label: 'Discovery', path: 'discovery-movie', needAuth: false },
          { label: 'Bookmarks', path: 'movie-bookmark-search', needAuth: true },
        ],
        needAuth: false,
      },
      b_tv: {
        single: false,
        label: 'TV Shows',
        paths: ['/tv', '/discovery-tv', '/tv-bookmark-search'],
        subMenu: [
          { label: 'Search', path: 'tv', needAuth: false },
          { label: 'Discovery', path: 'discovery-tv', needAuth: false },
          { label: 'Bookmarks', path: 'tv-bookmark-search', needAuth: true },
        ],
        needAuth: false,
      },
      c_people: {
        single: false,
        label: 'People',
        paths: ['/people'],
        subMenu: [{ label: 'Search', path: 'people', needAuth: false }],
        needAuth: false,
      },
      d_profile: {
        single: false,
        label: 'Profile',
        paths: ['/settings', '/logout'],
        subMenu: [
          { label: 'Settings', path: 'settings', needAuth: true },
          { label: 'Sign Out', path: 'logout', needAuth: true },
        ],
        needAuth: true,
      },
      d_signIn: {
        single: true,
        label: 'Sign In',
        paths: ['/login'],
        needAuth: false,
        onlyNonAuth: true,
      },
    },
  };
}

export function provideBookmarkStatusList() {
  return {
    provide: LIFECYCLE_STATUS_MAP,
    useValue: {
      noBookmark: {
        key: 'noBookmark',
        label: 'No bookmark',
        description: 'No bookmark',
      },
      watchlist: {
        key: 'watchlist',
        label: 'Watchlist',
        description: "I'd like to watch it!",
      },
      rewatch: {
        key: 'rewatch',
        label: 'Rewatch',
        description: "I'd like to watch it again!",
      },
      watching: {
        key: 'watching',
        label: 'Still Watching',
        description: "I'd like to finish it!",
      },
      watched: {
        key: 'watched',
        label: 'Watched',
        description: "I've already watched it!",
      },
    },
  };
}
