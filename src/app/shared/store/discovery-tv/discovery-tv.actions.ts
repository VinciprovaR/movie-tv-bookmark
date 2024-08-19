import { createAction, props } from '@ngrx/store';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const discoveryTVLanding = createAction(
  '[Discovery-tv] Discovery TV Landing Init'
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
  props<{ httpErrorResponse: HttpErrorResponse }>()
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
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const noAdditionalTV = createAction(
  '[Discovery-tv] No Additional TV Success'
);
