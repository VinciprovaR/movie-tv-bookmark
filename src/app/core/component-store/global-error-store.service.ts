import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { filter, tap } from 'rxjs/operators';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { GlobalErrorState } from '../../shared/interfaces/store/global-error.interface';

@Injectable({ providedIn: 'root' })
export class GlobalErrorStore extends ComponentStore<GlobalErrorState> {
  protected readonly router = inject(Router);
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);

  readonly selectError$ = this.select((state) => state.error);

  readonly isFailure = (action: CustomHttpErrorResponseInterface & Action) => {
    let type: string = action.type;
    return type.toLowerCase().includes('failure');
  };

  readonly isSuccess = (action: unknown & Action) => {
    let type: string = action.type;
    return type.toLowerCase().includes('success');
  };
  constructor() {
    super({ error: null });
  }

  readonly onError = this.updater(
    (state, error: CustomHttpErrorResponseInterface) => {
      return { error };
    }
  );

  readonly onSuccess = this.updater((state) => {
    return { error: null };
  });

  readonly errorEffect = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isFailure),
      tap((action: any) => {
        const { httpErrorResponse } = action;
        this.onError(httpErrorResponse);
        this.logError(httpErrorResponse);
      })
    );
  });

  readonly successEffect = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isSuccess),
      tap(() => {
        this.onSuccess();
      })
    );
  });

  private logError(error: CustomHttpErrorResponseInterface) {
    console.error(error);
  }
}
