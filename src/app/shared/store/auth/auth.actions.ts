import { createAction, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';
import { LoginPayload, RegisterPayload } from '../../models/auth-models';

export const login = createAction(
  '[Login/API] User Login',
  props<LoginPayload>()
);

export const register = createAction(
  '[Register/API] User Registration',
  props<RegisterPayload>()
);

export const currentUser = createAction('[Current User/API] User Validation');

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User | null }>()
);

export const registerSuccess = createAction('[Auth] Register success');

export const currentUserSuccess = createAction(
  '[Auth] Current User Success',
  props<{ user: User | null }>()
);

export const authFailure = createAction(
  '[Auth] Auth Failure',
  props<{ httpErrorResponse: any }>()
);

export const logout = createAction('[Logout/API] User Logout');

export const logoutSuccess = createAction('[Logout/API] Logout success');

export const cleanError = createAction('[Error Handling] Clean Error');
