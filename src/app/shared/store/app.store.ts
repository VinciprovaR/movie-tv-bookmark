import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthReducers } from './auth';
import { SearchMovieReducers } from './search-movie';
import { AuthState } from './auth/auth.reducer';
import { SearchMovieState } from './search-movie/search-movie.reducer';
import { LifecycleEnumState } from './lifecycle-enum/lifecycle.reducer';
import { LifecycleEnumReducers } from './lifecycle-enum';
import { SearchTVReducers } from './search-tv';
import { SearchTVState } from './search-tv/search-tv.reducer';
import { DiscoveryMovieReducers } from './discovery-movie';
import { DiscoveryMovieState } from './discovery-movie/discovery-movie.reducer';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMovieReducers.searchMovieFeatureKey]: SearchMovieState;
  [SearchTVReducers.searchTVFeatureKey]: SearchTVState;
  [LifecycleEnumReducers.lifecycleEnumFeatureKey]: LifecycleEnumState;
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]: DiscoveryMovieState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMovieReducers.searchMovieFeatureKey]:
    SearchMovieReducers.searchMovieReducer,
  [SearchTVReducers.searchTVFeatureKey]: SearchTVReducers.searchTVReducer,
  [LifecycleEnumReducers.lifecycleEnumFeatureKey]:
    LifecycleEnumReducers.lifecycleEnumReducer,
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]:
    DiscoveryMovieReducers.discoveryMovieReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];

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
