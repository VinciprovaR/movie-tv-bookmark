import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../../providers';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

/**
 * SupabaseAuthEventsService listen to differents supabase auth events.
 *
 * This service listen to different supabase auth events
 * to trigger differents behaviour based on the auth event.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthEventsService {
  private supabase;

  private readonly isPasswordRecovery$ = new BehaviorSubject<boolean>(false);
  readonly isPasswordRecoveryObs$ = this.isPasswordRecovery$.asObservable();

  private readonly isLoading$ = new BehaviorSubject<boolean>(true);
  readonly isLoadingObs$ = this.isLoading$.asObservable();

  readonly combined$: Observable<{
    isLoading: boolean;
    isPasswordRecovery: boolean;
  }> = combineLatest([this.isLoadingObs$, this.isPasswordRecoveryObs$]).pipe(
    map((combined: [boolean, boolean]) => {
      return { isLoading: combined[0], isPasswordRecovery: combined[1] };
    })
  );

  constructor() {
    this.supabase = inject(SUPABASE_CLIENT);
    this.initListeners();
  }

  initListeners() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.isLoading$.next(false);
      } else if (event === 'SIGNED_OUT') {
        this.isLoading$.next(false);
      } else if (event === 'PASSWORD_RECOVERY') {
        this.passwordRecoveryFlowStart();
        this.isLoading$.next(false);
      } else if (event === 'USER_UPDATED') {
        this.passwordRecoveryFlowEnd();
      }
    });
  }

  passwordRecoveryFlowStart() {
    this.isPasswordRecovery$.next(true);
  }

  passwordRecoveryFlowEnd() {
    this.isPasswordRecovery$.next(false);
  }
}
