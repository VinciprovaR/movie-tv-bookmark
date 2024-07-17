import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthReducers } from './auth';
import { SearchMovieReducers } from './search-movie';
import { SearchTVReducers } from './search-tv';
import { DiscoveryMovieReducers } from './discovery-movie';
import { AuthState } from '../interfaces/store/auth-state.interface';
import { DiscoveryMovieState } from '../interfaces/store/discovery-movie-state.interface';
import { SearchMovieState } from '../interfaces/store/search-movie-state.interface';
import { SearchTVState } from '../interfaces/store/search-tv-state.interface';
import { MovieLifecycleReducers } from './movie-lifecycle';
import { TVLifecycleReducers } from './tv-lifecycle';
import { MovieLifecycleState } from '../interfaces/store/movie-lifecycle-state.interface';
import { TVLifecycleState } from '../interfaces/store/tv-lifecycle-state.interface';
import { DiscoveryTVState } from '../interfaces/store/discovery-tv-state.interface';
import { DiscoveryTVReducers } from './discovery-tv';
import { LifecycleMetadataReducers } from './lifecycle-metadata';
import { LifecycleMetadataState } from '../interfaces/store/lifecycle-metadata-state.interface';
import { FiltersMetadataReducers } from './filters-metadata';
import { FiltersMetadataState } from '../interfaces/store/filters-metadata-state.interface';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMovieReducers.searchMovieFeatureKey]: SearchMovieState;
  [SearchTVReducers.searchTVFeatureKey]: SearchTVState;
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]: DiscoveryMovieState;
  [DiscoveryTVReducers.discoveryTVFeatureKey]: DiscoveryTVState;
  [MovieLifecycleReducers.movieLifecycleStateFeatureKey]: MovieLifecycleState;
  [TVLifecycleReducers.tvLifecycleStateFeatureKey]: TVLifecycleState;
  [LifecycleMetadataReducers.lifecycleMetadataStateFeatureKey]: LifecycleMetadataState;
  [FiltersMetadataReducers.filtersMetadataFeatureKey]: FiltersMetadataState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMovieReducers.searchMovieFeatureKey]:
    SearchMovieReducers.searchMovieReducer,
  [SearchTVReducers.searchTVFeatureKey]: SearchTVReducers.searchTVReducer,
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]:
    DiscoveryMovieReducers.discoveryMovieReducer,
  [DiscoveryTVReducers.discoveryTVFeatureKey]:
    DiscoveryTVReducers.discoveryTVReducer,
  [MovieLifecycleReducers.movieLifecycleStateFeatureKey]:
    MovieLifecycleReducers.movieLifecycleReducer,
  [TVLifecycleReducers.tvLifecycleStateFeatureKey]:
    TVLifecycleReducers.tvLifecycleReducer,
  [LifecycleMetadataReducers.lifecycleMetadataStateFeatureKey]:
    LifecycleMetadataReducers.LifecycleMetadataReducer,
  [FiltersMetadataReducers.filtersMetadataFeatureKey]:
    FiltersMetadataReducers.filtersMetadataReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [];

// console.log all actions
function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}
