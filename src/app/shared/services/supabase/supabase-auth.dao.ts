import { Inject, Injectable } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import { LoginPayload, RegisterPayload } from '../../models/auth.models';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  SupabaseClient,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthDAO {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  signInWithPassword(
    credentials: LoginPayload
  ): Observable<AuthTokenResponsePassword> {
    return from(
      this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      tap((result: any) => {
        if (result.error) throw new Error(result.error.message);
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
      tap((result: any) => {
        if (result.error) {
          if (result.error) throw new Error(result.error.message);
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
          if (result.error) throw new Error(result.error.message);
        }
      })
    ); //to-do captcha e redirect to
  }

  signOut(): Observable<any> {
    return from(this.supabase.auth.signOut()).pipe(
      tap((result: any) => {
        if (result.error) {
          if (result.error) throw new Error(result.error.message);
        }
      })
    );
  }

  getSession(): Observable<any> {
    return from(this.supabase.auth.getSession()).pipe(
      tap((result: any) => {
        if (result.error) {
          if (result.error) throw new Error(result.error.message);
        }
      })
    );
  }
}
