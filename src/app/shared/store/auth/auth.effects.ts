import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SupabaseAuthService } from '../../services/supabase';
import { Router } from '@angular/router';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from '@supabase/supabase-js/';
import { ErrorResponse } from '../../interfaces/error.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((credentials) => {
        return this.supabaseAuthService.login(credentials).pipe(
          tap((result: AuthTokenResponsePassword) => {
            this.router.navigate(['/home']);
          }),
          map((result: AuthTokenResponsePassword) => {
            return AuthActions.loginSuccess({
              user: result.data.user as User,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((credentials) => {
        return this.supabaseAuthService.register(credentials).pipe(
          tap((result: AuthResponse) => {
            this.router.navigate(['/register-success'], {
              queryParams: { email: result.data.user?.email },
            });
          }),
          map(() => {
            return AuthActions.registerSuccess();
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  currentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.currentUser),
      switchMap(() => {
        return this.supabaseAuthService.getCurrentUser().pipe(
          map((result: any) => {
            return AuthActions.currentUserSuccess({
              user: result.data.session?.user,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.supabaseAuthService.logout().pipe(
          tap(() => {
            this.router.navigate(['/login']);
          }),
          map(() => {
            return AuthActions.logoutSuccess();
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  requestResetPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.requestResetPassword),
      switchMap((credentials) => {
        return this.supabaseAuthService.sendMailResetPassword(credentials).pipe(
          tap((result: any) => {
            this.router.navigate(['/reset-password-sent']);
          }),
          map(() => {
            return AuthActions.requestResetPasswordSuccess();
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private supabaseAuthService: SupabaseAuthService,
    private router: Router
  ) {}
}
