import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../shared/interfaces/store/auth-state.interface';
import * as AuthReducer from './auth.reducer';

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

export const selectIsLoadingForCurrentUser = createSelector(
  authFeatureSelector,
  AuthReducer.getIsLoadingCurrentUser
);

export const selectIsLoadingForPasswordValidation = createSelector(
  authFeatureSelector,
  AuthReducer.getIsLoadingForPasswordValidation
);

export const selectUser = createSelector(
  authFeatureSelector,
  AuthReducer.getUser
);

export const selectError = createSelector(
  authFeatureSelector,
  AuthReducer.getAuthError
);

export const selectMessageSuccessOperation = createSelector(
  authFeatureSelector,
  AuthReducer.getMessageSuccessOperation
);
