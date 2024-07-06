import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile } from 'rxjs';
import { AuthSelectors } from '../store/auth';
import { AuthState } from '../interfaces/store/auth-state.interface';

export const authGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthSelectors.selectAuth).pipe(
    skipWhile((authState: AuthState) => authState.isLoading),
    map((authState: AuthState) => {
      if (!!authState.user == false) {
        return router.parseUrl('/login');
      } else if (!authState.user?.confirmed_at) {
        return router.parseUrl('/login');
      } else {
        return true;
      }
    })
  );
};
