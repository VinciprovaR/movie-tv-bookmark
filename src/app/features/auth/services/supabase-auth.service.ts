import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  SignOut,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { STORAGE_KEY_TOKEN } from '../../../providers';
import { WebStorageService } from '../../../services/web-storage.service';
import {
  LoginPayload,
  PublicUserEntity,
  RegisterPayload,
} from '../../../shared/interfaces/supabase/supabase-auth.interface';
import { SupabaseAuthDAO } from './supabase-auth.dao';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private readonly storageKey = inject(STORAGE_KEY_TOKEN);
  private readonly webStorageService = inject(WebStorageService);
  private readonly supabaseAuthDAO = inject(SupabaseAuthDAO);
  private readonly router = inject(Router);

  constructor() {}

  login(credentials: LoginPayload): Observable<AuthTokenResponsePassword> {
    return this.supabaseAuthDAO.signInWithPassword(credentials);
  }

  validateCurrentPassword(credentials: LoginPayload): Observable<any> {
    return this.supabaseAuthDAO.validateCurrentPassword(credentials);
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

  validateCurrentUser(): Observable<User | null> {
    return this.supabaseAuthDAO.getSession().pipe(
      switchMap((result: any) => {
        if (result.data.session) {
          //session is present in local storage, verify server side if is valid
          return this.supabaseAuthDAO.getUser().pipe(
            tap((result: UserResponse) => {
              if (result.error || !result.data.user) {
                this.webStorageService.destroyItem(this.storageKey);
                this.router.navigate(['/login']);
                throw new CustomHttpErrorResponse({
                  error: result.error,
                  message: 'User session not valid, please login again',
                  status: result.error?.status ? result.error?.status : 403,
                });
              }
            }),
            map((result: UserResponse) => {
              return result.data.user;
            })
          );
        }
        //session is not present in local storage, user is null
        return of(null);
      })
    );
  }

  getCurrentSession(): Observable<any> {
    return this.supabaseAuthDAO.getSession();
  }

  getCurrentUser(): Observable<any> {
    return this.supabaseAuthDAO.getUser();
  }

  deleteUserAccount(userId: string): Observable<PublicUserEntity[]> {
    return this.supabaseAuthDAO.deleteUserFromPublicSchema(userId);
  }
}
