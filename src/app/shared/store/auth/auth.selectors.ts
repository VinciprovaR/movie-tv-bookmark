import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AuthReducer from './auth.reducer';
import { AuthState } from './auth.reducer';

const authFeatureSelector = createFeatureSelector<AuthState>(
  AuthReducer.authFeatureKey
);

export const selectAuth = createSelector(
  authFeatureSelector,
  AuthReducer.getAuthState
);

export const selectIsLoading = createSelector(
  authFeatureSelector,
  AuthReducer.getIsLoading
);

export const selectUser = createSelector(
  authFeatureSelector,
  AuthReducer.getUser
);

export const selectError = createSelector(
  authFeatureSelector,
  AuthReducer.getAuthError
);
