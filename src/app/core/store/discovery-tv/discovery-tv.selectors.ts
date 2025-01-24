import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiscoveryTVState } from '../../../shared/interfaces/store/discovery-tv-state.interface';
import * as DiscoveryTVReducer from './discovery-tv.reducer';
import { Subject, Observable } from 'rxjs';

const discoveryTVFeatureSelector = createFeatureSelector<DiscoveryTVState>(
  DiscoveryTVReducer.discoveryTVFeatureKey
);

export const selectDiscoveryTV = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getDiscoveryTVState
);

export const selectIsLoading = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getIsLoading
);

export const selectPayload = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getPayload
);

export const selectTVResult = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getTVResult
);

export const selectTVList = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getTVList
);

export const selectTVPage = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getTVResultPage
);

export const selectTVTotalPages = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getTVResultTotalPages
);

export const selectError = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getDiscoveryTVError
);

export const selectNoAdditional = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getNoAdditional
);

export const selectIsFirstLanding = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getIsFirstLanding
);

export const selectInfiniteScrollDisabled = createSelector(
  discoveryTVFeatureSelector,
  DiscoveryTVReducer.getInfiniteScrollDisabled
);

export const scrollTo$ = new Subject<null>();
export const scrollToObs$: Observable<null> = scrollTo$.asObservable();
