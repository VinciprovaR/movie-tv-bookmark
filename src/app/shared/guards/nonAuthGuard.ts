import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile } from 'rxjs';
import { AuthActions, AuthSelectors } from '../store/auth';
import { AuthState } from '../interfaces/store/auth-state.interface';

export const nonAuthGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  store.dispatch(AuthActions.currentUser());

  return store.select(AuthSelectors.selectAuth).pipe(
    skipWhile((authState: AuthState) => authState.isLoadingCurrentUser),
    map((authState: AuthState) => {
      if (!!authState.user && authState.user?.confirmed_at) {
        return router.parseUrl('/home');
      } else {
        return true;
      }
    })
  );
};
