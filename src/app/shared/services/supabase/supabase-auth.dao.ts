import { inject, Injectable } from '@angular/core';
import { Observable, from, map, tap } from 'rxjs';
import {
  CustomSessionResponse,
  LoginPayload,
  RegisterPayload,
  UserSupabase,
} from '../../interfaces/supabase/supabase-auth.interface';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  PostgrestSingleResponse,
  ResendParams,
  SignOut,
  UserResponse,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';

import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  constructor() {}

  signInWithPassword(
    credentials: LoginPayload
  ): Observable<AuthTokenResponsePassword> {
    return from(
      this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      tap((result: AuthTokenResponsePassword) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: `${result.error.message} for ${credentials.email}`,
            status: result.error.status,
          });
        }
      })
    );
  }

  signUp(credentials: RegisterPayload): Observable<AuthResponse> {
    return from(
      this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      tap((result: AuthResponse) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  getUserByEmail(credentials: RegisterPayload): Observable<UserSupabase[]> {
    return from(
      this.supabase.from('users').select('*').eq(`email`, credentials.email)
    ).pipe(
      map((result: PostgrestSingleResponse<UserSupabase[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        }
        return result.data;
      })
    );
  }

  resendConfirmationRegister(email: string): Observable<AuthResponse> {
    return from(this.supabase.auth.resend({ email, type: 'signup' })).pipe(
      tap((result: AuthResponse) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  resetPasswordForEmail(credentials: { email: string }): Observable<any> {
    return from(
      this.supabase.auth.resetPasswordForEmail(credentials.email)
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  updatePassword(password: string): Observable<any> {
    return from(this.supabase.auth.updateUser({ password })).pipe(
      tap((result: any) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  signOut(signout: SignOut): Observable<any> {
    return from(this.supabase.auth.signOut(signout)).pipe(
      tap((result: any) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  deleteUserAccount(userId: string): Observable<any> {
    return from(
      this.supabase.from('users').delete().eq(`user_id`, userId).select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  deleteUserFromPublicSchema(userId: string): Observable<any> {
    console.log('deleteUserFromPublicSchema, user id: ', userId);
    return from(
      this.supabase.from('users').delete().eq('user_id', userId).select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }

  getUser(): Observable<UserResponse> {
    //Throw error is handled on effect side for this service, because if the session is invalid on server side, it needed to clean the session on client side first

    return from(this.supabase.auth.getUser());
  }

  getSession(): Observable<CustomSessionResponse> {
    return from(this.supabase.auth.getSession()).pipe(
      tap((result) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: result.error.status,
          });
        }
      })
    );
  }
}
