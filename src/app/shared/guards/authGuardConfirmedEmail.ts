import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile, tap } from 'rxjs';
import { AuthActions, AuthSelectors } from '../store/auth';
import { AuthState } from '../interfaces/store/auth-state.interface';

export const authGuardConfirmedEmail: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  store.dispatch(AuthActions.currentUser());

  return store.select(AuthSelectors.selectAuth).pipe(
    skipWhile((authState: AuthState) => authState.isLoading),
    map((authState: AuthState) => {
      if (!!authState.user == false) {
        return router.parseUrl('/login');
      } else if (!authState.user?.confirmed_at) {
        return router.parseUrl('/login');
      } else {
        if (
          authState.user?.confirmed_at &&
          new Date().getTime() -
            new Date(authState.user.confirmed_at).getTime() <
            30000
        ) {
          return true;
        }
        return router.parseUrl('/home');
      }
    })
  );
};
