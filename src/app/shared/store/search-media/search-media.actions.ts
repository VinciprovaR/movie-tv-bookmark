import { createAction, props } from '@ngrx/store';
import { MovieDetail, MovieResult, TVDetail, TVResult } from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaType } from '../../models/media.models';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';
import { TV_Life_Cycle } from '../../models/supabase/entities/tv_life_cycle.entity';

export const searchMedia = createAction(
  '[Search-media/API] Search Media',
  props<{ query: string; mediaType: MediaType }>()
);
export const searchMediaSuccess = createAction(
  '[Search-media/API] Search Media Success',
  props<{ mediaResult: MovieResult | TVResult }>()
);

export const searchAdditionalMedia = createAction(
  '[Search-media/API] Search Additional Media',
  props<{ mediaType: MediaType }>()
);
export const searchAdditionalMediaSuccess = createAction(
  '[Search-media/API] Search Media Additional Success',
  props<{ mediaResult: MovieResult | TVResult | null }>()
);

export const searchMediaDetail = createAction(
  '[Search-media/API] Search Media Detail',
  props<{ mediaId: number; mediaType: MediaType }>()
);
export const searchMediaDetailSuccess = createAction(
  '[Search-media/API] Search Media Detail Success',
  props<{ mediaDetail: MovieDetail | TVDetail }>()
);

export const noAdditionalMedia = createAction(
  '[Search-media/API] No Additional Media'
);

export const searchMediaFailure = createAction(
  '[Search-media/API] Search Media Failure',
  props<{ httpErrorResponse: any }>()
);

//Media... lifecycle

export const getMediaLifecycleEnum = createAction(
  '[Search-media/API] Get Media Lifecycle Enum',
  props<{ mediaType: MediaType }>()
);

export const getMediaLifecycleEnumSuccess = createAction(
  '[Search-media/API] Get Media Lifecycle Enum Success',
  props<{ lifecycleEnum: Media_Lifecycle_Enum[] }>()
);

export const createUpdateDeleteMediaLifecycle = createAction(
  '[Media-Lifecycle/API] Create or Update or Delete Media Lifecycle',
  props<{ mediaLifecycle: MediaLifecycleDTO; mediaType: MediaType }>()
);
export const createUpdateDeleteMediaLifecycleSuccess = createAction(
  '[Media-Lifecycle/API] Create or Update or Delete Media Lifecycle Success',
  props<{
    entityMediaLifeCycle: Movie_Life_Cycle | TV_Life_Cycle;
    index: number;
  }>()
);

export const deleteMediaLifecycle = createAction(
  '[Media-Lifecycle/API] Delete Media Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMediaLifecycleSuccess = createAction(
  '[Media-Lifecycle/API] Delete Media Lifecycle Success'
);

export const mediaLifecycleFailure = createAction(
  '[Media-Lifecycle/API] Media-Lifecycle Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-movie/Error Handling] Clean Error'
);
