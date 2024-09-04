import { inject, Injectable } from '@angular/core';
import { SupabaseAuthDAO } from './supabase-auth.dao';
import {
  AuthTokenResponsePassword,
  AuthResponse,
  SignOut,
  ResendParams,
  UserResponse,
  User,
} from '@supabase/supabase-js';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import {
  CustomSessionResponse,
  LoginPayload,
  PublicUserEntity,
  RegisterPayload,
  UserSupabase,
} from '../../interfaces/supabase/supabase-auth.interface';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';
import { WebStorageService } from '../web-storage.service';
import { STORAGE_KEY_TOKEN } from '../../../providers';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private readonly storageKey = inject(STORAGE_KEY_TOKEN);
  private readonly webStorageService = inject(WebStorageService);
  private readonly router = inject(Router);

  constructor(private supabaseAuthDAO: SupabaseAuthDAO) {}

  login(credentials: LoginPayload): Observable<AuthTokenResponsePassword> {
    return this.supabaseAuthDAO.signInWithPassword(credentials);
  }

  validateCurrentPassword(credentials: LoginPayload): Observable<any> {
    return this.supabaseAuthDAO.validateCurrentPassword(credentials);
  }

  register(credentials: RegisterPayload): Observable<AuthResponse> {
    return this.supabaseAuthDAO.getUserByEmail(credentials).pipe(
      tap((userSupabaseResultList: UserSupabase[]) => {
        if (
          userSupabaseResultList &&
          userSupabaseResultList.length > 0 &&
          userSupabaseResultList[0].email === credentials.email
        ) {
          throw new CustomHttpErrorResponse({
            error: 'User already registered',
            message: `User already registered with email ${credentials.email}`,
            status: 409,
          });
        }
      }),
      switchMap(() => {
        return this.supabaseAuthDAO.signUp(credentials);
      })
    );
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
        //session is not present in local storage, user is null, no login
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.supabaseAuthDAO.getUser();
  }

  getCurrentSession(): Observable<any> {
    return this.supabaseAuthDAO.getSession();
  }

  deleteUserAccount(userId: string): Observable<PublicUserEntity[]> {
    return this.supabaseAuthDAO.deleteUserFromPublicSchema(userId);
  }
}
