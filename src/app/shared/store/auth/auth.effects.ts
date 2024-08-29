import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { NavigationExtras, Router } from '@angular/router';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from '@supabase/supabase-js/';

import { SupabaseAuthService } from '../../services/supabase';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

@Injectable()
export class AuthEffects {
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);
  private readonly supabaseAuthService = inject(SupabaseAuthService);

  constructor() {}

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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
            this.router.navigate(['/login']);
          }),
          map(() => {
            return AuthActions.requestResetPasswordSuccess({
              notifyMsg: 'Request reset password sent!',
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  updatePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.updatePassword),
      switchMap((action) => {
        return this.supabaseAuthService.updatePassword(action.password).pipe(
          map(() => {
            return AuthActions.updatePasswordSuccess();
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(AuthActions.authFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });
}
