import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthReducers } from './auth';
import { SearchMovieReducers } from './search-movie';
import { SearchTVReducers } from './search-tv';
import { DiscoveryMovieReducers } from './discovery-movie';
import { AuthState } from '../models/store/auth-state.models';
import { DiscoveryMovieState } from '../models/store/discovery-movie-state.models';
import { SearchMovieState } from '../models/store/search-movie-state.models';
import { SearchTVState } from '../models/store/search-tv-state.models';
import { MovieLifecycleReducers } from './movie-lifecycle';

import { TVLifecycleReducers } from './tv-lifecycle';
import { MovieLifecycleState } from '../models/store/movie-lifecycle-state.models';
import { TVLifecycleState } from '../models/store/tv-lifecycle-state.models';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMovieReducers.searchMovieFeatureKey]: SearchMovieState;
  [SearchTVReducers.searchTVFeatureKey]: SearchTVState;
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]: DiscoveryMovieState;
  [MovieLifecycleReducers.movieLifecycleStateFeatureKey]: MovieLifecycleState;
  [TVLifecycleReducers.tvLifecycleStateFeatureKey]: TVLifecycleState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMovieReducers.searchMovieFeatureKey]:
    SearchMovieReducers.searchMovieReducer,
  [SearchTVReducers.searchTVFeatureKey]: SearchTVReducers.searchTVReducer,
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]:
    DiscoveryMovieReducers.discoveryMovieReducer,
  [MovieLifecycleReducers.movieLifecycleStateFeatureKey]:
    MovieLifecycleReducers.movieLifecycleReducer,
  [TVLifecycleReducers.tvLifecycleStateFeatureKey]:
    TVLifecycleReducers.tvLifecycleReducer,
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
