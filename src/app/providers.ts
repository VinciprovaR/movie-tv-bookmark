import { APP_INITIALIZER, InjectionToken } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthActions } from './shared/store/auth';
import { BookmarkMetadataActions } from './shared/store/bookmark-metadata';
import { FiltersMetadataActions } from './shared/store/filters-metadata';
import {
  BookmarkNavElement,
  NavElements,
} from './shared/interfaces/navigator.interface';
import { BookmarkStatusMap } from './shared/interfaces/supabase/supabase-bookmark.interface';
import { RandomMediaImageService } from './shared/services/random-media-image.service';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>(
  'supabase-client'
);
//to-do Temporary test api key
export const TMDB_API_KEY = new InjectionToken<string>('TMDB_API_KEY');
export const TMDB_BASE_URL = new InjectionToken<string>('TMDB_BASE_URL');

export const IMG_SIZES = {
  TMDB_ORIGINAL_IMG_URL: new InjectionToken<string>('TMDB_ORIGINAL_IMG_URL'),
  TMDB_PROFILE_300W_450H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_300W_450H_IMG_URL'
  ),
  TMDB_PROFILE_600W_900H_IMG_URL: new InjectionToken<string>(
    'TMDB_PROFILE_600W_900H_IMG_URL'
  ),

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
      provide: IMG_SIZES.TMDB_PROFILE_300W_450H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_600W_900H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_440W_660H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w440_and_h660_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_260W_390H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w260_and_h390_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1920W_800H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w1920_and_h800_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1000W_450H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w1000_and_h450_bestv2',
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
      provide: IMG_SIZES.TMDB_PROFILE_92W_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w92',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_66W_66H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w66_and_h66_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_132W_132H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w132_and_h132_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_1920W_1080H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w1920_and_h1080_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_138W_175H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w138_and_h175_bestv2',
    },
    {
      provide: IMG_SIZES.TMDB_PROFILE_276W_350H_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w276_and_h350_bestv2',
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
    useValue: 'isdt',
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
      movie: {
        label: 'Movie',
        subMenu: [
          { label: 'Search', path: 'movie' },
          { label: 'Discovery', path: 'discovery-movie' },
          { label: 'Bookmarks', path: 'movie-bookmark-search' },
        ],
      },
      tv: {
        label: 'TV Shows',
        subMenu: [
          { label: 'Search', path: 'tv' },
          { label: 'Discovery', path: 'discovery-tv' },
          { label: 'Bookmarks', path: 'tv-bookmark-search' },
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

export function provideRandomMediaImage() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (randomMediaImageService: RandomMediaImageService) => () => {
      randomMediaImageService.initMedia();
    },
    deps: [RandomMediaImageService],
    multi: true,
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
