import { createAction, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const login = createAction(
  '[Auth/API] User Login',
  props<LoginPayload>()
);
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);

export const register = createAction(
  '[Auth/API] User Registration',
  props<RegisterPayload>()
);
export const registerSuccess = createAction('[Auth/API] Register Success');

export const requestResetPassword = createAction(
  '[Auth/API] Request Reset Password',
  props<{ email: string }>()
);
export const requestResetPasswordSuccess = createAction(
  '[Auth/API] Request Reset Password Success'
);

export const currentUser = createAction('[Auth/API] Current User');
export const currentUserSuccess = createAction(
  '[Auth/API] Current User Success',
  props<{ user: User | null }>()
);

export const authFailure = createAction(
  '[Auth/API] Auth Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const logout = createAction('[Logout/API] User Logout');
export const logoutSuccess = createAction('[Logout/API] Logout success');

export const cleanError = createAction('[Error Handling] Clean Error');
