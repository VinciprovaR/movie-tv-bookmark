import { createAction, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';
import { HttpErrorResponse } from '@angular/common/http';

//login
export const login = createAction('[Auth] User Login', props<LoginPayload>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

//register
export const register = createAction(
  '[Auth] User Registration',
  props<RegisterPayload>()
);
export const registerSuccess = createAction('[Auth] Register Success');

//request reset psw
export const requestResetPassword = createAction(
  '[Auth] Request Reset Password',
  props<{ email: string }>()
);
export const requestResetPasswordSuccess = createAction(
  '[Auth] Request Reset Password Success'
);

//current user
export const currentUser = createAction('[Auth] Current User');
export const currentUserSuccess = createAction(
  '[Auth] Current User Success',
  props<{ user: User | null }>()
);

//logout
export const logout = createAction('[Logout] User Logout');
export const logoutSuccess = createAction('[Logout] Logout success');

//generic failure
export const authFailure = createAction(
  '[Auth] Auth Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);
