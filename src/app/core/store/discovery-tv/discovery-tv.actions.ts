import { createAction, props } from '@ngrx/store';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { PayloadDiscoveryTV } from '../../../shared/interfaces/store/discovery-tv-state.interface';
import { TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

export const cleanState = createAction('[Discovery-tv] Clean State');
export const resetFilters = createAction('[Discovery-tv] Reset Filters');
//search
export const discoveryTVLanding = createAction(
  '[Discovery-tv] Discovery TV Landing Init'
);
export const discoveryTVLandingSuccess = createAction(
  '[Discovery-tv] Discovery TV Landing Success',
  props<{ tvResult: TVResult }>()
);
export const discoveryTVLandingFailure = createAction(
  '[Discovery-TV] Discovery TV Landing Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const discoveryTV = createAction(
  '[Discovery-tv] Discovery TV Init',
  props<{ payload: PayloadDiscoveryTV }>()
);

export const discoveryTVSuccess = createAction(
  '[Discovery-tv] Discovery TV Success',
  props<{ tvResult: TVResult }>()
);
export const discoveryTVFailure = createAction(
  '[Discovery-TV] Discovery TV Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const discoveryAdditionalTV = createAction(
  '[Discovery-tv] Discovery Additional TV Init'
);
export const discoveryAdditionalTVSuccess = createAction(
  '[Discovery-tv] Discovery TV Additional Success',
  props<{ tvResult: TVResult }>()
);
export const discoveryAdditionaTVFailure = createAction(
  '[Discovery-TV] Discovery Additional TV Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const noAdditionalTV = createAction(
  '[Discovery-tv] No Additional TV Success'
);
