import { inject, Injectable } from '@angular/core';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  PostgrestSingleResponse,
  SignOut,
  UserResponse,
} from '@supabase/supabase-js';
import { from, map, Observable, tap } from 'rxjs';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { SUPABASE_CLIENT } from '../../../providers';
import {
  CustomSessionResponse,
  LoginPayload,
  PublicUserEntity,
  RegisterPayload,
} from '../../../shared/interfaces/supabase/supabase-auth.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

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

  validateCurrentPassword(credentials: LoginPayload): Observable<any> {
    return from(
      this.supabase.rpc('verify_user_password', {
        password: credentials.password,
      })
    ).pipe(
      tap((result: PostgrestSingleResponse<boolean>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: `${result.error.message} for ${credentials.email}`,
            status: +result.error.code,
          });
        }
        if (result.data === false) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: `Password verification failed, wrong password`,
            status: 403,
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
      map((result: any) => {
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

  deleteUserFromPublicSchema(userId: string): Observable<PublicUserEntity[]> {
    return from(
      this.supabase.from('users').delete().eq('user_id', userId).select()
    ).pipe(
      map((result: PostgrestSingleResponse<PublicUserEntity[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
            status: +result.error.code,
          });
        }
        return result.data;
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
