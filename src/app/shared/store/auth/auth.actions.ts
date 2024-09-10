import { createAction, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';
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
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ email: string }>()
);

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
  props<{ email: string }>()
);
export const resendConfirmationRegisterFailure = createAction(
  '[Auth] Resend Confirmation Email Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//request reset psw
export const requestResetPassword = createAction(
  '[Auth] Request Reset Password',
  props<{ email: string }>()
);
export const requestResetPasswordSuccess = createAction(
  '[Auth] Request Reset Password Success',
  props<{ email: string }>()
);
export const requestResetPasswordFailure = createAction(
  '[Auth] Request Reset Password Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const requestResetPasswordAuthenticated = createAction(
  '[Auth] Request Reset Password Authenticated'
);
export const requestResetPasswordAuthenticatedSuccess = createAction(
  '[Auth] Request Reset Password Authenticated Success',
  props<{ email: string }>()
);
export const requestResetPasswordAuthenticatedFailure = createAction(
  '[Auth] Request Reset Password Authenticated Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
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
export const deleteAccount = createAction(
  '[Auth] Delete Account',
  props<{ password: string }>()
);
export const deleteAccountSuccess = createAction(
  '[Auth] Delete Account Success',
  props<{ email: string }>()
);
export const deleteAccountFailure = createAction(
  '[Auth] Delete Account Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const deleteAccountFailureUserInvalid = createAction(
  '[Auth] Delete Account Failure User Invalid',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//generic failure
export const authFailure = createAction(
  '[Auth] Auth Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const cleanMessageSuccessOperation = createAction(
  '[Auth] Clean Message Success Operation'
);
