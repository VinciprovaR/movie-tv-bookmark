import { Injectable } from '@angular/core';
import { SupabaseAuthDAO } from './supabase-auth.dao';
import {
  AuthTokenResponsePassword,
  AuthResponse,
  SignOut,
  ResendParams,
} from '@supabase/supabase-js';
import { Observable, from, tap } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
} from '../../interfaces/supabase/supabase-auth.interface';

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

  resendConfirmationRegister(email: string): Observable<AuthResponse> {
    return this.supabaseAuthDAO.resendConfirmationRegister(email);
  }

  sendMailResetPassword(credentials: { email: string }): Observable<any> {
    return this.supabaseAuthDAO.resetPasswordForEmail(credentials);
  }

  updatePassword(password: string): Observable<any> {
    return this.supabaseAuthDAO.updatePassword(password);
  }

  logOut(signout: SignOut): Observable<any> {
    return this.supabaseAuthDAO.signOut(signout);
  }

  getCurrentUser(): Observable<any> {
    return this.supabaseAuthDAO.getUser();
  }

  getCurrentSession(): Observable<any> {
    return this.supabaseAuthDAO.getSession();
  }
}
