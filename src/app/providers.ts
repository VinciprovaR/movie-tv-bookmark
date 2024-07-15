import { APP_INITIALIZER, InjectionToken } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthActions } from './shared/store/auth';
import { OptionFilter } from './shared/interfaces/TMDB/tmdb-filters.interface';
import { DiscoveryMovieActions } from './shared/store/discovery-movie';
import { DiscoveryTVActions } from './shared/store/discovery-tv';
import { LifecycleMetadataActions } from './shared/store/lifecycle-metadata';
import { FiltersMetadataActions } from './shared/store/filters-metadata';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>(
  'supabase-client'
);
//Temporary test api key
export const TMDB_API_KEY = new InjectionToken<string>('TMDB_API_KEY');
export const TMDB_BASE_URL = new InjectionToken<string>('TMDB_BASE_URL');
export const TMDB_ORIGINAL_IMG_URL = new InjectionToken<string>(
  'TMDB_ORIGINAL_IMG_URL'
);
export const TMDB_RESIZED_IMG_URL = new InjectionToken<string>(
  'TMDB_RESIZED_IMG_URL'
);
export const TMDB_CARD_1X_IMG_URL = new InjectionToken<string>(
  'TMDB_CARD_1X_IMG_URL'
);
export const TMDB_CARD_2X_IMG_URL = new InjectionToken<string>(
  'TMDB_CARD_2X_IMG_URL'
);

export const I18E = new InjectionToken<string>('I18E');

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
      provide: TMDB_ORIGINAL_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/original',
    },
    {
      provide: TMDB_RESIZED_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    },
    {
      provide: TMDB_CARD_1X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w220_and_h330_face',
    },
    {
      provide: TMDB_CARD_2X_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w440_and_h660_face',
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

//to-do hardcoded, cambiare in i18e corretto
export function provideI18E() {
  return {
    provide: I18E,
    useValue: 'IT',
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
