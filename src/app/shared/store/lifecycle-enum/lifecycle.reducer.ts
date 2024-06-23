import { createReducer, on } from '@ngrx/store';
import * as LifecycleActions from './lifecycle.actions';
import { ErrorResponse, MovieDetail, MovieResult } from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';

export interface LifecycleEnumState {
  isLoading: boolean;

  error: ErrorResponse | null;

  lifecycleEnum: Media_Lifecycle_Enum[] | [];
}

export const lifecycleEnumFeatureKey = 'lifecycle-enum';

export const initialState: LifecycleEnumState = {
  isLoading: false,
  error: null,
  lifecycleEnum: [],
};

export const lifecycleEnumReducer = createReducer(
  initialState,
  on(LifecycleActions.lifecycleEnum, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(LifecycleActions.lifecycleEnumSuccess, (state, { lifecycleEnum }) => {
    return {
      ...state,
      error: null,
      lifecycleEnum,
    };
  }),
  on(LifecycleActions.lifecycleFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      error: httpErrorResponse,
    };
  }),
  on(LifecycleActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getLifecycleEnumState = (state: LifecycleEnumState) => state;
export const getIsLoading = (state: LifecycleEnumState) => state.isLoading;

export const getLifecycleEnum = (state: LifecycleEnumState) =>
  state.lifecycleEnum;
export const getlifecycleEnumError = (state: LifecycleEnumState) => state.error;
