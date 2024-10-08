import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from '@supabase/supabase-js/';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AuthSelectors } from '.';
import { SupabaseAuthService } from '../../../features/auth/services/supabase-auth.service';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { STORAGE_KEY_TOKEN } from '../../../providers';
import { WebStorageService } from '../../../services/web-storage.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { PublicUserEntity } from '../../../shared/interfaces/supabase/supabase-auth.interface';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);
  private readonly supabaseAuthService = inject(SupabaseAuthService);
  private readonly storageKey = inject(STORAGE_KEY_TOKEN);
  private readonly webStorageService = inject(WebStorageService);

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
                  return this.handleLogout(scope, result);
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

  private handleLogout(scope: 'local' | 'global', result: any) {
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
      catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
        return of(AuthActions.loginFailure({ httpErrorResponse }));
      })
    );
  }

  requestResetPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.requestResetPassword,
        AuthActions.requestResetPasswordAuthenticated
      ),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((metadata) => {
        let [action, user] = metadata;
        user = user as User;
        let email = '';
        if (action.type === AuthActions.requestResetPassword.type) {
          email = action.email;
        } else if (
          action.type === AuthActions.requestResetPasswordAuthenticated.type
        ) {
          email = user.email as string;
        }

        return this.supabaseAuthService.sendMailResetPassword({ email }).pipe(
          tap(() => {
            if (
              action.type === AuthActions.requestResetPasswordAuthenticated.type
            ) {
              this.store.dispatch(
                AuthActions.logoutGlobal({ scope: 'global' })
              );
            }
            this.router.navigate(['/login']);
          }),
          map(() => {
            return AuthActions.requestResetPasswordSuccess({
              email,
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

  deleteUserAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      switchMap((action) => {
        const { password } = action;
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
            return this.supabaseAuthService
              .validateCurrentPassword({
                email: user.email as string,
                password,
              })
              .pipe(
                switchMap(() => {
                  return this.handleDeleteAccount(user);
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

  private handleDeleteAccount(user: User) {
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
  }
}
