import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  lifeCycleId,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

export const initTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Init TV Lifecycle Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);
export const createUpdateDeleteTVLifecycle = createAction(
  '[TV-Lifecycle-C/API] Create or Update or Delete TV Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO<TV> }>()
);
export const createUpdateDeleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Create or Update or Delete TV Lifecycle Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);
export const deleteTVLifecycle = createAction(
  '[TV-Lifecycle-C/API] Delete TV Lifecycle',
  props<{ tvId: number }>()
);
export const deleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Delete TV Lifecycle Success'
);

export const searchTVByLifecycleLanding = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Landing',
  props<{ payload: null; lifecycleId: lifeCycleId }>()
);
export const searchTVByLifecycleSubmit = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Submit',
  props<{ lifecycleId: lifeCycleId; payload: PayloadMediaLifecycle }>()
);

export const searchTVByLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Success',
  props<{ tvList: TV_Life_Cycle[] & TV_Data[] }>()
);
export const updateSearchTVByLifecycle = createAction(
  '[TV-Lifecycle/API] Update Search TV By Lifecycle '
);

//error
export const lifecycleFailure = createAction(
  '[TV-Lifecycle-C/API] Search TV Failure',
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[TV-Lifecycle-C/Error Handling] Clean Error'
);
