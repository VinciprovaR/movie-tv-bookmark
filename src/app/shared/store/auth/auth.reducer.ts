import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../../interfaces/store/auth-state.interface';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  isLoading: false,
  error: null,
  user: null,
  isRequestResetPassword: false,
  isResetPasswordSuccess: false,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    AuthActions.register,
    AuthActions.currentUser,
    AuthActions.requestResetPassword,
    AuthActions.logout,
    AuthActions.updatePassword,
    (state): AuthState => {
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
    (state, { user }): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        user,
      };
    }
  ),
  on(AuthActions.registerSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      user: null, //to-do user cmq valorizzato
    };
  }),
  on(AuthActions.authFailure, (state, { httpErrorResponse }): AuthState => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
    };
  }),
  on(AuthActions.logoutSuccess, (state): AuthState => {
    //to-do check se necessario qui
    return {
      ...state,
      error: null,
      isLoading: false,
      user: null,
    };
  }),
  on(AuthActions.requestResetPasswordSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isRequestResetPassword: true,
    };
  }),
  on(AuthActions.clearRequestResetPassword, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isRequestResetPassword: false,
    };
  }),
  on(AuthActions.updatePasswordSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isResetPasswordSuccess: true,
    };
  })
);
export const getAuthState = (state: AuthState) => state;
export const getIsLoading = (state: AuthState) => state.isLoading;
export const getUser = (state: AuthState) => state.user;
export const getAuthError = (state: AuthState) => state.error;
export const getIsRequestResetPassword = (state: AuthState) =>
  state.isRequestResetPassword;
export const getIsResetPasswordSuccess = (state: AuthState) =>
  state.isResetPasswordSuccess;
