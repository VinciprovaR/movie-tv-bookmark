import { Inject, Injectable, inject } from '@angular/core';
import { Observable, from, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebStorageService } from './web-storage.service';
import { LoginPayload, RegisterPayload } from '../models/auth-models';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../provider';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webStorageService: WebStorageService,
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient
  ) {}

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

  logout(): Observable<any> {
    return from(this.supabase.auth.signOut());
  }

  getCurrentUser(): Observable<any> {
    return from(this.supabase.auth.getSession());
  }

  setAuth(jwtToken: string, remember = false): void {
    this.webStorageService.saveJwtToken(jwtToken);
    //this.webStorageService.saveRememberMe(remember);
  }

  setAuthValidation(jwtToken: string): void {
    this.webStorageService.saveJwtToken(jwtToken);
  }

  purgeAuth(): void {
    this.webStorageService.destroyJwtToken();
    this.webStorageService.destroyRemember();
  }
}
