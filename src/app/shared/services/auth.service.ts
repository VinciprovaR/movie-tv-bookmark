import { Inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LoginPayload, RegisterPayload } from '../models/auth.models';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  SupabaseClient,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../providers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  login(credentials: LoginPayload): Observable<AuthTokenResponsePassword> {
    return from(
      this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    );
  }

  register(credentials: RegisterPayload): Observable<AuthResponse> {
    return from(
      this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })
    );
  }

  sendMailResetPassword(credentials: { email: string }): Observable<any> {
    return from(this.supabase.auth.resetPasswordForEmail(credentials.email)); //to-do captcha e redirect to
  }

  logout(): Observable<any> {
    return from(this.supabase.auth.signOut());
  }

  getCurrentUser(): Observable<any> {
    return from(this.supabase.auth.getSession());
  }
}
