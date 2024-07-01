import { Injectable } from '@angular/core';
import { SupabaseAuthDAO } from './supabase-auth.dao';
import { AuthTokenResponsePassword, AuthResponse } from '@supabase/supabase-js';
import { Observable, from, tap } from 'rxjs';
import { LoginPayload, RegisterPayload } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  constructor(private supabaseAuthDAO: SupabaseAuthDAO) {}

  login(credentials: LoginPayload): Observable<AuthTokenResponsePassword> {
    return this.supabaseAuthDAO.signInWithPassword(credentials);
  }

  register(credentials: RegisterPayload): Observable<AuthResponse> {
    return this.supabaseAuthDAO.signUp(credentials);
  }

  sendMailResetPassword(credentials: { email: string }): Observable<any> {
    return this.supabaseAuthDAO.resetPasswordForEmail(credentials);
  }

  logout(): Observable<any> {
    return this.supabaseAuthDAO.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.supabaseAuthDAO.getSession();
  }
}
