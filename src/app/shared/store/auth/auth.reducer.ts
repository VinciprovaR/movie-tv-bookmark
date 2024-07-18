import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../../interfaces/store/auth-state.interface';

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
    AuthActions.requestResetPassword,
    AuthActions.logout,
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
        error: null,
        isLoading: false,
        user,
      };
    }
  ),
  on(AuthActions.registerSuccess, (state): AuthState => {
    return {
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
  on(
    AuthActions.logoutSuccess,
    AuthActions.requestResetPasswordSuccess,
    (state): AuthState => {
      //to-do check se necessario qui
      return {
        ...state,
        error: null,
        isLoading: false,
        user: null,
      };
    }
  )
);
export const getAuthState = (state: AuthState) => state;
export const getIsLoading = (state: AuthState) => state.isLoading;
export const getUser = (state: AuthState) => state.user;
export const getAuthError = (state: AuthState) => state.error;
