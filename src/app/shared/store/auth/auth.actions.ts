import { createAction, props } from '@ngrx/store';
import { SignOut, User, UserResponse } from '@supabase/supabase-js';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

//login
export const login = createAction('[Auth] User Login', props<LoginPayload>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//register
export const register = createAction(
  '[Auth] User Registration',
  props<RegisterPayload>()
);
export const registerSuccess = createAction('[Auth] Register Success');

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const cleanRegisterFlow = createAction('[Auth] Clean Register Flow');

export const resendConfirmationRegister = createAction(
  '[Auth] Resend Confirmation Email',
  props<{ email: string }>()
);
export const resendConfirmationRegisterSuccess = createAction(
  '[Auth] Resend Confirmation Email Success',
  props<{ notifyMsg: string }>()
);
export const resendConfirmationRegisterFailure = createAction(
  '[Auth] Resend Confirmation Email Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const cleanResendConfirmationRegisterFlow = createAction(
  '[Auth] Clean Resend Confirmation Email Flow'
);

//request reset psw
export const requestResetPassword = createAction(
  '[Auth] Request Reset Password',
  props<{ email: string }>()
);
export const requestResetPasswordSuccess = createAction(
  '[Auth] Request Reset Password Success',
  props<{ notifyMsg: string }>()
);
export const cleanRequestResetPassword = createAction(
  '[Auth] Clean Request Reset Password '
);

//update psw
export const updatePassword = createAction(
  '[Auth] Update Password',
  props<{ password: string }>()
);
export const updatePasswordSuccess = createAction(
  '[Auth] Update Password Success'
);
export const updatePasswordFailure = createAction(
  '[Auth] Update Password Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//current user
export const currentUser = createAction('[Auth] Current User');
export const currentUserSuccess = createAction(
  '[Auth] Current User Success',
  props<{ user: User | null }>()
);
export const currentUserFailure = createAction(
  '[Auth] Current User Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//logout
export const logoutLocal = createAction(
  '[Auth] User Logout Local',
  props<{ scope: 'local' }>()
);
export const logoutLocalSuccess = createAction('[Auth] Logout Local Success');

export const logoutGlobal = createAction(
  '[Auth] User Logout Global',
  props<{ scope: 'global' }>()
);
export const logoutGlobalSuccess = createAction('[Auth] Logout Global Success');

//delete account
export const deleteAccount = createAction('[Auth] Delete Account');
export const deleteAccountSuccess = createAction(
  '[Auth] Delete Account Success',
  props<{ user: User | null }>()
);
export const deleteAccountFailure = createAction(
  '[Auth] Delete Account Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const deleteAccountFailureUserInvalid = createAction(
  '[Auth] Delete Account Failure User Invalid',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const cleanAccountDeletedFlow = createAction(
  '[Auth] Delete Account Flow'
);

//generic failure
export const authFailure = createAction(
  '[Auth] Auth Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
