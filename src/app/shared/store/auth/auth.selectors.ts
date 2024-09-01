import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AuthReducer from './auth.reducer';
import { AuthState } from '../../interfaces/store/auth-state.interface';

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

export const selectIsRequestResetPassword = createSelector(
  authFeatureSelector,
  AuthReducer.getIsRequestResetPassword
);

export const selectIsResetPasswordSuccess = createSelector(
  authFeatureSelector,
  AuthReducer.getIsResetPasswordSuccess
);

export const selectRegisterFlowEnd = createSelector(
  authFeatureSelector,
  AuthReducer.getRegisterFlowEnd
);

export const selectIsResendConfirmationRegister = createSelector(
  authFeatureSelector,
  AuthReducer.getIsResendConfirmationRegister
);
