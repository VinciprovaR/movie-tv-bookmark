import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile } from 'rxjs';
import { AuthState } from '../../shared/interfaces/store/auth-state.interface';
import { AuthActions, AuthSelectors } from '../store/auth';

export const authGuardConfirmedEmail: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  store.dispatch(AuthActions.currentUser());

  return store.select(AuthSelectors.selectAuth).pipe(
    skipWhile((authState: AuthState) => authState.isLoadingCurrentUser),
    map((authState: AuthState) => {
      if (!authState.user) {
        return router.parseUrl('/home');
      } else if (!authState.user?.confirmed_at) {
        return router.parseUrl('/home');
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
