import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, skipWhile } from 'rxjs';
import { SupabaseAuthEventsService } from '../services/supabase-auth-events.service';

export const passwordRecoveryGuard: CanMatchFn = () => {
  const supabaseAuthEventsService = inject(SupabaseAuthEventsService);
  const router = inject(Router);

  return supabaseAuthEventsService.combined$.pipe(
    skipWhile((combined) => combined.isLoading),
    map((combined) => {
      if (!combined.isPasswordRecovery) {
        return router.parseUrl('/home');
      } else {
        return true;
      }
    })
  );
};
