import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

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
import { PublicUserEntity } from '../../interfaces/supabase/supabase-auth.interface';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '.';

@Injectable()
export class AuthEffects {
  private readonly store = inject(Store);
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
            return of(AuthActions.loginFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  fakeLoginForValidation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginForValidation),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ password }, user] = action;
        user = user as User;
        return this.supabaseAuthService
          .login({ email: user.email as string, password })
          .pipe(
            map((result: AuthTokenResponsePassword) => {
              return AuthActions.loginForValidationSuccess();
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  AuthActions.loginForValidationFailure({ httpErrorResponse })
                );
              }
            )
          );
      })
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((credentials) => {
        return this.supabaseAuthService.register(credentials).pipe(
          tap(() => {
            this.router.navigate(['/login']);
          }),
          map((result: AuthResponse) => {
            const email = result.data.user?.email ? result.data.user.email : '';
            return AuthActions.registerSuccess({ email });
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
            tap(() => {
              this.router.navigate(['/login']);
            }),
            map((result: AuthResponse) => {
              console.log(result);
              return AuthActions.resendConfirmationRegisterSuccess({
                email: action.email,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  AuthActions.resendConfirmationRegisterFailure({
                    httpErrorResponse,
                  })
                );
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
        return this.supabaseAuthService.validateCurrentUser().pipe(
          map((user: User | null) => {
            return AuthActions.currentUserSuccess({
              user,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(AuthActions.currentUserFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  //to-do refractor in service
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
                switchMap((result: any) => {
                  if (result.error) {
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
                          AuthActions.loginFailure({ httpErrorResponse })
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
          tap(() => {
            this.router.navigate(['/login']);
          }),
          map(() => {
            return AuthActions.requestResetPasswordSuccess({
              email: credentials.email,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(
              AuthActions.requestResetPasswordFailure({ httpErrorResponse })
            );
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

  requestResetPasswordAuthenticated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.requestResetPasswordAuthenticated),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      tap((action) => {
        let [type, user] = action;
        user = user as User;
        this.store.dispatch(AuthActions.logoutGlobal({ scope: 'global' }));
        this.store.dispatch(
          AuthActions.requestResetPassword({ email: user.email as string })
        );
      }),
      map((action) => {
        let [type, user] = action;
        user = user as User;
        return AuthActions.requestResetPasswordAuthenticatedSuccess({
          email: user.email as string,
        });
      }),
      catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
        return of(
          AuthActions.requestResetPasswordAuthenticatedFailure({
            httpErrorResponse,
          })
        );
      })
    );
  });

  deleteUserAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      switchMap(() => {
        return this.supabaseAuthService.validateCurrentUser().pipe(
          tap((user: User | null) => {
            if (!user) {
              this.router.navigate(['/login']);
            }
          }),
          map((user: User | null) => {
            if (!user) {
              throw new CustomHttpErrorResponse({
                type: 'userNull',
                error: 'User session not valid, please login again',
                message: 'User session not valid, please login again',
                status: 403,
              });
            }
            return user;
          }),
          switchMap((user: User) => {
            console.log('delete account, user is valid: ', user);
            return this.supabaseAuthService.deleteUserAccount(user.id).pipe(
              map((publicUserEntityResult: PublicUserEntity[]) => {
                if (publicUserEntityResult.length === 0) {
                  throw new CustomHttpErrorResponse({
                    type: 'userNull',
                    error: 'User not found',
                    message: 'User not found',
                    status: 404,
                  });
                }
                const email = publicUserEntityResult[0].email;
                return AuthActions.deleteAccountSuccess({ email });
              }),
              tap(() => {
                this.webStorageService.destroyItem(this.storageKey);
                this.router.navigate(['/login']);
              })
            );
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            if (
              httpErrorResponse.type &&
              httpErrorResponse.type === 'userNull'
            ) {
              return of(
                AuthActions.deleteAccountFailureUserInvalid({
                  httpErrorResponse,
                })
              );
            }
            return of(AuthActions.deleteAccountFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });
}
