import { APP_INITIALIZER, InjectionToken } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthActions } from './shared/store/auth';

import { SupabaseMovieLifecycleService } from './shared/services/supabase.movie_life_cycle.service';
import { SearchMediaActions } from './shared/store/search-media';
import { Media_Lifecycle_Enum } from './shared/models/supabase/entities/media_life_cycle_enum.entity';

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

export const LIFECYCLE_ENUM = new InjectionToken<Media_Lifecycle_Enum>(
  'LIFECYCLE_ENUM'
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
      provide: TMDB_ORIGINAL_IMG_URL,
      useValue: 'https://media.themoviedb.org/t/p/original',
    },
    {
      provide: TMDB_RESIZED_IMG_URL,
      useValue: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    },
  ];
}

export function provideAppInitializer() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () =>
      store.dispatch(AuthActions.currentUser()),
    deps: [Store],
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

export function provideLifecycleEnum() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (store: Store) => () =>
      store.dispatch(SearchMediaActions.getMediaLifecycleEnum()),
    deps: [Store],
    multi: true,
  };
}
