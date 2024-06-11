import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../../models/auth-state';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  isLoading: false,
  error: null,
  user: null,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    AuthActions.register,
    AuthActions.currentUser,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    AuthActions.loginSuccess,
    AuthActions.currentUserSuccess,
    (state, { user }) => {
      return {
        error: null,
        isLoading: false,
        user,
      };
    }
  ),
  on(AuthActions.registerSuccess, (state) => {
    return {
      error: null,
      isLoading: false,
      user: null, //to-do user cmq valorizzato
    };
  }),
  on(AuthActions.authFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
    };
  }),
  on(AuthActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  }),
  on(AuthActions.logout, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(AuthActions.logoutSuccess, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      user: null,
    };
  })
);
export const getAuthState = (state: AuthState) => state;
export const getIsLoading = (state: AuthState) => state.isLoading;
export const getUser = (state: AuthState) => state.user;
export const getAuthError = (state: AuthState) => state.error;
