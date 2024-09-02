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
  isResendConfirmationRegister: false,
  isAccountDeleted: false,
  registerFlowEnd: false,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    AuthActions.register,
    AuthActions.currentUser,
    AuthActions.requestResetPassword,
    AuthActions.logoutGlobal,
    AuthActions.logoutLocal,
    AuthActions.updatePassword,
    AuthActions.resendConfirmationRegister,
    AuthActions.deleteAccount,
    (state): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        registerFlowEnd: false,
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
        registerFlowEnd: false,
      };
    }
  ),
  on(AuthActions.registerSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      user: null,
      registerFlowEnd: true,
    };
  }),

  on(
    AuthActions.logoutLocalSuccess,
    AuthActions.logoutGlobal,
    (state): AuthState => {
      //to-do check se necessario qui
      return {
        ...state,
        error: null,
        isLoading: false,
        user: null,
        registerFlowEnd: false,
      };
    }
  ),
  on(AuthActions.requestResetPasswordSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isRequestResetPassword: true,
      registerFlowEnd: false,
    };
  }),
  on(AuthActions.resendConfirmationRegisterSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isResendConfirmationRegister: true,
      registerFlowEnd: false,
    };
  }),
  on(AuthActions.cleanRequestResetPassword, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isRequestResetPassword: false,
      registerFlowEnd: false,
    };
  }),
  on(AuthActions.cleanResendConfirmationRegisterFlow, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isResendConfirmationRegister: false,
      registerFlowEnd: false,
    };
  }),
  on(AuthActions.updatePasswordSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isResetPasswordSuccess: true,
      registerFlowEnd: false,
    };
  }),
  on(AuthActions.deleteAccountSuccess, (state, { user }): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isAccountDeleted: true,
      user,
      registerFlowEnd: false,
    };
  }),
  on(
    AuthActions.currentUserFailure,
    AuthActions.deleteAccountFailureUserInvalid,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        registerFlowEnd: false,
        user: null,
      };
    }
  ),
  on(
    AuthActions.cleanAccountDeletedFlow,

    (state): AuthState => {
      return {
        ...state,
        isLoading: false,
        error: null,
        registerFlowEnd: false,
        isAccountDeleted: false,
        user: null,
      };
    }
  ),
  on(
    AuthActions.authFailure,
    AuthActions.loginFailure,
    AuthActions.updatePasswordFailure,
    AuthActions.resendConfirmationRegisterFailure,
    AuthActions.registerFailure,
    AuthActions.deleteAccountFailure,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        registerFlowEnd: false,
      };
    }
  )
);
export const getAuthState = (state: AuthState) => state;
export const getIsLoading = (state: AuthState) => state.isLoading;
export const getUser = (state: AuthState) => state.user;
export const getAuthError = (state: AuthState) => state.error;
export const getIsRequestResetPassword = (state: AuthState) =>
  state.isRequestResetPassword;
export const getIsResetPasswordSuccess = (state: AuthState) =>
  state.isResetPasswordSuccess;
export const getIsResendConfirmationRegister = (state: AuthState) =>
  state.isResendConfirmationRegister;
export const getRegisterFlowEnd = (state: AuthState) => state.registerFlowEnd;
export const getisAccountDeleted = (state: AuthState) => state.isAccountDeleted;
