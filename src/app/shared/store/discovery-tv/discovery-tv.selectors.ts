import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as DiscoveryTVReducer from './discovery-tv.reducer';
import { DiscoveryTVState } from '../../interfaces/store/discovery-tv-state.interface';

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
