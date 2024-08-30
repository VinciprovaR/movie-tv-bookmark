import { inject, Injectable } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  SignOut,
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
            message: result.error.message,
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
    console.log('logout: ', signout);
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

  getUser(): Observable<any> {
    //Throw error is handled on effect side for this service, because if the session is invalid on server side, it needed to clean the session on client side first
    return from(this.supabase.auth.getUser());
  }

  getSession(): Observable<any> {
    return from(this.supabase.auth.getSession()).pipe(
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
}
