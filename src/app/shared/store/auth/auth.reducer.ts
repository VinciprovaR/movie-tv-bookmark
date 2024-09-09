import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../../interfaces/store/auth-state.interface';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  isLoading: false,
  isLoadingForPasswordValidation: false,
  error: null,
  user: null,
  messageSuccessOperation: '',
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    AuthActions.register,
    AuthActions.currentUser,
    AuthActions.requestResetPassword,
    AuthActions.requestResetPasswordAuthenticated,
    AuthActions.logoutGlobal,
    AuthActions.logoutLocal,
    AuthActions.updatePassword,
    AuthActions.resendConfirmationRegister,
    (state): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(AuthActions.deleteAccount, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoadingForPasswordValidation: true,
    };
  }),
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
  on(AuthActions.registerSuccess, (state, { email }): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      user: null,
      messageSuccessOperation: `We've sent you an email to ${email} with
              instructions to confirm your account, if not already registered. 
              Please check your inbox, and don't forget to check your
              spam or junk folder if you don't see the email within a few
              minutes!`,
    };
  }),

  on(
    AuthActions.logoutLocalSuccess,
    AuthActions.logoutGlobal,
    (state): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        user: null,
        messageSuccessOperation: `You have been successfully logged out!`,
      };
    }
  ),
  on(
    AuthActions.requestResetPasswordAuthenticatedSuccess,
    (state, { email }): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        messageSuccessOperation: `We've sent you an email to ${email} with
              instructions to reset your password. Please
              check your inbox, and don't forget to check your spam or junk
              folder if you don't see the email within a few minutes!`,
      };
    }
  ),
  on(AuthActions.requestResetPasswordSuccess, (state, { email }): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      messageSuccessOperation: `We've sent you an email to ${email} with
              instructions to reset your password, if the account exist. Please
              check your inbox, and don't forget to check your spam or junk
              folder if you don't see the email within a few minutes!`,
    };
  }),
  on(
    AuthActions.resendConfirmationRegisterSuccess,
    (state, { email }): AuthState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        messageSuccessOperation: `We've sent you an email to ${email} with
              instructions to confirm your account, if not confirmed yet and if
              created. Please check your inbox, and don't forget to check your
              spam or junk folder if you don't see the email within a few
              minutes!`,
      };
    }
  ),
  on(AuthActions.updatePasswordSuccess, (state): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      messageSuccessOperation: `Your password has been changed successfully`,
    };
  }),

  on(AuthActions.deleteAccountSuccess, (state, { email }): AuthState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      isLoadingForPasswordValidation: false,
      messageSuccessOperation: `Account with email ${email} deleted successfully!`,
      user: null,
    };
  }),
  on(
    AuthActions.currentUserFailure,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        user: null,
      };
    }
  ),
  on(
    AuthActions.deleteAccountFailureUserInvalid,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoadingForPasswordValidation: false,
        error: httpErrorResponse,
        user: null,
      };
    }
  ),
  on(AuthActions.cleanMessageSuccessOperation, (state): AuthState => {
    return {
      ...state,
      isLoading: false,
      error: null,
      messageSuccessOperation: '',
    };
  }),
  on(
    AuthActions.authFailure,
    AuthActions.loginFailure,
    AuthActions.requestResetPasswordFailure,
    AuthActions.requestResetPasswordAuthenticatedFailure,
    AuthActions.updatePasswordFailure,
    AuthActions.resendConfirmationRegisterFailure,
    AuthActions.registerFailure,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  ),
  on(
    AuthActions.deleteAccountFailure,
    (state, { httpErrorResponse }): AuthState => {
      return {
        ...state,
        isLoadingForPasswordValidation: false,
        error: httpErrorResponse,
      };
    }
  )
);
export const getAuthState = (state: AuthState) => state;
export const getIsLoading = (state: AuthState) => state.isLoading;
export const getIsLoadingForPasswordValidation = (state: AuthState) =>
  state.isLoadingForPasswordValidation;
export const getUser = (state: AuthState) => state.user;
export const getAuthError = (state: AuthState) => state.error;
export const getMessageSuccessOperation = (state: AuthState) =>
  state.messageSuccessOperation;
