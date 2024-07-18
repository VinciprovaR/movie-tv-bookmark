import { inject, Inject, Injectable } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { HttpErrorResponse } from '@angular/common/http';

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
        if (result.error) throw new HttpErrorResponse(result.error);
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
          if (result.error) throw new HttpErrorResponse(result.error);
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
          if (result.error) throw new HttpErrorResponse(result.error);
        }
      })
    ); //to-do captcha e redirect to
  }

  signOut(): Observable<any> {
    return from(this.supabase.auth.signOut()).pipe(
      tap((result: any) => {
        if (result.error) {
          if (result.error) throw new HttpErrorResponse(result.error);
        }
      })
    );
  }

  getSession(): Observable<any> {
    return from(this.supabase.auth.getSession()).pipe(
      tap((result: any) => {
        if (result.error) {
          if (result.error) throw new HttpErrorResponse(result.error);
        }
      })
    );
  }
}
