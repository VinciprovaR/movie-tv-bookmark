import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthReducers } from './auth';
import { SearchMovieReducers } from './search-movie';
import { AuthState, SearchMovieState } from '../models';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMovieReducers.searchMovieFeatureKey]: SearchMovieState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMovieReducers.searchMovieFeatureKey]:
    SearchMovieReducers.searchMovieReducer,
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
