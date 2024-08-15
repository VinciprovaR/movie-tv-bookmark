import { APP_INITIALIZER, InjectionToken } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthActions } from './shared/store/auth';
import { LifecycleMetadataActions } from './shared/store/lifecycle-metadata';
import { FiltersMetadataActions } from './shared/store/filters-metadata';
import {
  LifecycleNavElement,
  NavElements,
} from './shared/interfaces/navigator.interface';
import { LifecycleStatusMap } from './shared/interfaces/supabase/supabase-lifecycle.interface';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>(
  'supabase-client'
);
//to-do Temporary test api key
export const TMDB_API_KEY = new InjectionToken<string>('TMDB_API_KEY');
export const TMDB_BASE_URL = new InjectionToken<string>('TMDB_BASE_URL');

export const IMG_SIZES = {
  TMDB_ORIGINAL_IMG_URL: new InjectionToken<string>('TMDB_ORIGINAL_IMG_URL'),
  TMDB_PROFILE_1X_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_1X_IMG_URL'
  ),
  TMDB_PROFILE_2X_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_2X_IMG_URL'
  ),
  TMDB_DETAIL_LIST_1X_IMG_URL: new InjectionToken<string>(
    'TMDB_DETAIL_LIST_1X_IMG_URL'
  ),
  TMDB_DETAIL_LIST_2X_IMG_URL: new InjectionToken<string>(
    'TMDB_DETAIL_LIST_2X_IMG_URL'
  ),
  TMDB_SEARCH_LIST_1X_IMG_URL: new InjectionToken<string>(
    'TMDB_SEARCH_LIST_1X_IMG_URL'
  ),
  TMDB_SEARCH_LIST_2X_IMG_URL: new InjectionToken<string>(
    'TMDB_SEARCH_LIST_2X_IMG_URL'
  ),
  TMDB_MULTI_FACE_1X_IMG_URL: new InjectionToken<string>(
    'TMDB_MULTI_FACE_1X_IMG_URL'
  ),
  TMDB_MULTI_FACE_2X_IMG_URL: new InjectionToken<string>(
    'TMDB_MULTI_FACE_2X_IMG_URL'
  ),
  TMDB_W_300_IMG_URL: new InjectionToken<string>('TMDB_W_300_IMG_URL'),
  TMDB_W_400_IMG_URL: new InjectionToken<string>('TMDB_W_400_IMG_URL'),
  TMDB_W_500_IMG_URL: new InjectionToken<string>('TMDB_W_500_IMG_URL'),
  TMDB_LOGO_SIZE_IMG: new InjectionToken<string>('TMDB_LOGO_SIZE_IMG'),
  TMDB_CREDITS_IMG_URL: new InjectionToken<string>('TMDB_CREDITS_IMG_URL'),
  TMDB_CREDITS_HQ_IMG_URL: new InjectionToken<string>(
    'TMDB_CREDITS_HQ_IMG_URL'
  ),
};

export const LIFECYCLE_NAV_ELEMENTS = new InjectionToken<LifecycleNavElement[]>(
  'LIFECYCLE_NAV_ELEMENTS'
);

export const HEADER_NAV_ELEMENTS = new InjectionToken<NavElements>(
  'HEADER_NAV_ELEMENTS'
);

export const LIFECYCLE_STATUS_MAP = new InjectionToken<LifecycleStatusMap>(
  'LIFECYCLE_STATUS_MAP'
);
export const THEME_KEY_LOCAL_STORAGE = new InjectionToken<string>(
  'THEME_KEY_LOCAL_STORAGE'
);

export function provideTMDBApiKey() {
  return {
    provide: TMDB_API_KEY,
    useValue: '752d0986327eafd63e68291a07153a54',
  };
}

export function provideTMDBBaseUrl() {
  return {
    provide: TMDB_BASE_URL,
    useValue: 'https://api.themoviedb.org/3',
  };
}

export function provideImgUrl() {
  return [
    {
      provide: IMG_SIZES.TMDB_ORIGINAL_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/original',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_2X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    },

    {
      provide: IMG_SIZES.TMDB_DETAIL_LIST_1X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w138_and_h175_face',
    },
    {
      provide: IMG_SIZES.TMDB_DETAIL_LIST_2X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w276_and_h350_face',
    },

    {
      provide: IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w220_and_h330_face',
    },
    {
      provide: IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w440_and_h660_face',
    },
    {
      provide: IMG_SIZES.TMDB_MULTI_FACE_2X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces',
    },
    {
      provide: IMG_SIZES.TMDB_MULTI_FACE_1X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w1000_and_h450_multi_faces',
    },
    {
      provide: IMG_SIZES.TMDB_W_300_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w300',
    },
    {
      provide: IMG_SIZES.TMDB_W_400_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w400',
    },
    {
      provide: IMG_SIZES.TMDB_W_500_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w500',
    },
    {
      provide: IMG_SIZES.TMDB_LOGO_SIZE_IMG,
      useValue: 'https://image.tmdb.org/t/p/w92',
    },
    {
      provide: IMG_SIZES.TMDB_CREDITS_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w66_and_h66_face',
    },
    {
      provide: IMG_SIZES.TMDB_CREDITS_HQ_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w132_and_h132_face',
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

export function provideLifecycleSelect() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () => {
      store.dispatch(LifecycleMetadataActions.retriveLifecycleMetadata());
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
    useValue: 'isdt',
  };
}

export function provideLifecycleNavElements() {
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
      movie: {
        label: 'Movie',
        subMenu: [
          { label: 'Search', path: 'movie' },
          { label: 'Discovery', path: 'discovery-movie' },
          { label: 'Bookmarks', path: 'movie-lifecycle-search' },
        ],
      },
      tv: {
        label: 'TV Shows',
        subMenu: [
          { label: 'Search', path: 'tv' },
          { label: 'Discovery', path: 'discovery-tv' },
          { label: 'Bookmarks', path: 'tv-lifecycle-search' },
        ],
      },
      people: {
        label: 'People',
        subMenu: [{ label: 'Search', path: 'people' }],
      },
      userProfile: {
        label: 'User Profile',
        subMenu: [{ label: 'User Profile', path: 'user-profile' }],
      },
    },
  };
}

export function provideLifecycleStatusList() {
  return {
    provide: LIFECYCLE_STATUS_MAP,
    useValue: {
      noLifecycle: {
        key: 'noLifecycle',
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

export function provideSupabaseClient() {
  return {
    provide: SUPABASE_CLIENT,
    useFactory: () =>
      createClient(
        'https://fahpcnjaykumnjwfmkdy.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaHBjbmpheWt1bW5qd2Zta2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMjYzOTUsImV4cCI6MjAzMzYwMjM5NX0.wq98GdUuiqA1e_9aYJlQC1TKyoLeRdh_IP2mALY7mCc'
      ),
  };
}
