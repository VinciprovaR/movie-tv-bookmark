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
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';
import { WebStorageService } from '../../services/web-storage.service';
import { STORAGE_KEY_TOKEN } from '../../../providers';

@Injectable()
export class AuthEffects {
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);
  private readonly supabaseAuthService = inject(SupabaseAuthService);
  private readonly storageKey = inject(STORAGE_KEY_TOKEN);
  private readonly webStorageService = inject(WebStorageService);
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
            this.router.navigate(['/login'], {
              queryParams: { email: result.data.user?.email },
            });
          }),
          map(() => {
            return AuthActions.registerSuccess();
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(AuthActions.registerFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  resendConfirmationRegister$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.resendConfirmationRegister),
      switchMap((action) => {
        return this.supabaseAuthService
          .resendConfirmationRegister(action.email)
          .pipe(
            tap((result: AuthResponse) => {
              console.log(result);
              this.router.navigate(['/login'], {
                queryParams: { email: action.email },
              });
            }),
            map(() => {
              return AuthActions.resendConfirmationRegisterSuccess({
                notifyMsg: 'Request confirmation email sent!',
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(AuthActions.registerFailure({ httpErrorResponse }));
              }
            )
          );
      })
    );
  });

  currentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.currentUser),
      switchMap(() => {
        return this.supabaseAuthService.getCurrentSession().pipe(
          switchMap((result: any) => {
            if (result.data.session) {
              //session is present in local storage, verify server side if is valid
              return this.supabaseAuthService.getCurrentUser().pipe(
                tap((result: any) => {
                  if (result.error) {
                    this.webStorageService.destroyItem(this.storageKey);
                    throw new CustomHttpErrorResponse({
                      error: result.error,
                      message: 'User session not valid, please login again',
                      status: result.error.status,
                    });
                  }
                }),
                map((result: any) => {
                  return AuthActions.currentUserSuccess({
                    user: result.data.user,
                  });
                })
              );
            }
            //session is not present in local storage, user is null, no login
            return of(
              AuthActions.currentUserSuccess({
                user: null,
              })
            );
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
      ofType(AuthActions.logoutLocal, AuthActions.logoutGlobal),
      switchMap((action) => {
        const { scope } = action;
        return this.supabaseAuthService.getCurrentSession().pipe(
          switchMap((result: any) => {
            if (result.data.session) {
              //session is present in local storage, verify server side if is valid
              return this.supabaseAuthService.getCurrentUser().pipe(
                map((result: any) => {
                  if (result.error) {
                    return { currentUserError: true };
                  }
                  return { currentUserError: false };
                }),
                switchMap((result: { currentUserError: boolean }) => {
                  if (result.currentUserError) {
                    return of(AuthActions.logoutLocalSuccess()).pipe(
                      tap(() => {
                        this.webStorageService.destroyItem(this.storageKey);
                        this.router.navigate(['/login']);
                      })
                    );
                  }
                  return this.supabaseAuthService.logOut({ scope }).pipe(
                    tap(() => {
                      this.router.navigate(['/login']);
                    }),
                    map(() => {
                      if (scope === 'global') {
                        return AuthActions.logoutGlobalSuccess();
                      }
                      return AuthActions.logoutLocalSuccess();
                    }),
                    catchError(
                      (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                        return of(
                          AuthActions.authFailure({ httpErrorResponse })
                        );
                      }
                    )
                  );
                })
              );
            }
            //session is not present in local storage, user is null, silent logout
            return of(AuthActions.logoutLocalSuccess()).pipe(
              tap(() => {
                this.router.navigate(['/login']);
              })
            );
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
          tap((result: AuthResponse) => {
            this.router.navigate(['/login'], {
              queryParams: { email: credentials.email },
            });
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
            return of(AuthActions.updatePasswordFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });
}
