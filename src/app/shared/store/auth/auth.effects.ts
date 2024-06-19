import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js/';
import { ErrorResponse } from '../../models/auth.models';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((credentials) => {
        return this.authService.login(credentials).pipe(
          tap((result: AuthTokenResponsePassword) => {
            this.router.navigate(['/home']);
          }),
          map((result: AuthTokenResponsePassword) => {
            return AuthActions.loginSuccess({
              user: result.data.user,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
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
        return this.authService.register(credentials).pipe(
          tap((result: AuthResponse) => {
            this.router.navigate(['/register-success'], {
              queryParams: { email: result.data.user?.email },
            });
          }),
          map(() => {
            return AuthActions.registerSuccess();
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
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
        return this.authService.getCurrentUser().pipe(
          map((result: any) => {
            return AuthActions.currentUserSuccess({
              user: result.data.session?.user,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
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
        return this.authService.logout().pipe(
          tap(() => {
            this.router.navigate(['/login']);
          }),
          map(() => {
            return AuthActions.logoutSuccess();
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
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
        return this.authService.sendMailResetPassword(credentials).pipe(
          tap((result: any) => {
            this.router.navigate(['/reset-password-sent']);
          }),
          map(() => {
            return AuthActions.requestResetPasswordSuccess();
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
