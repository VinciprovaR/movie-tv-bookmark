import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../../providers';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthEventsService {
  private readonly supabase = inject(SUPABASE_CLIENT);

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

  constructor() {}

  initEvent() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
      } else if (event === 'SIGNED_IN') {
        this.isLoading$.next(false);
      } else if (event === 'SIGNED_OUT') {
        this.isLoading$.next(false);
      } else if (event === 'PASSWORD_RECOVERY') {
        this.passwordRecoveryFlowStart();
        this.isLoading$.next(false);
      } else if (event === 'TOKEN_REFRESHED') {
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
