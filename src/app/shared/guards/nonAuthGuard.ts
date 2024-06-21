import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile } from 'rxjs';
import { AuthSelectors } from '../store/auth';
import { AuthState } from '../store/auth/auth.reducer';

export const nonAuthGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthSelectors.selectAuth).pipe(
    skipWhile((authState: AuthState) => authState.isLoading),
    map((authState: AuthState) => {
      if (!!authState.user && authState.user?.confirmed_at) {
        return router.parseUrl('/home');
      } else {
        return true;
      }
    })
  );
};
