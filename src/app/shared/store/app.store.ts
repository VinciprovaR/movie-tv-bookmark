import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthReducers } from './auth';
import { SearchMultiReducers } from './search-multi';
import { AuthState, SearchMultiState } from '../models';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMultiReducers.searchMultiFeatureKey]: SearchMultiState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMultiReducers.searchMultiFeatureKey]:
    SearchMultiReducers.searchMultiReducer,
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
