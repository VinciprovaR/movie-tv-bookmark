import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Alert, notificationType } from '../interfaces/alert.interface';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Router } from '@angular/router';

export interface GlobalErrorState {
  error: HttpErrorResponse | null;
}

@Injectable({ providedIn: 'root' })
export class GlobalErrorStore extends ComponentStore<GlobalErrorState> {
  protected readonly router = inject(Router);
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);

  readonly selectError$ = this.select((state) => state.error);

  readonly isFailure = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('failure');
  };

  readonly isSuccess = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('success');
  };
  constructor() {
    super({ error: null });
  }

  readonly onError = this.updater((state, error: HttpErrorResponse) => {
    return { error };
  });

  readonly onSuccess = this.updater((state) => {
    return { error: null };
  });

  readonly errorEffect = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isFailure),
      tap((action: any & TypedAction<string>) => {
        const { httpErrorResponse } = action;

        //this.router.navigate(['/home']);

        this.onError(httpErrorResponse);
        this.logError(httpErrorResponse);
      })
    );
  });

  readonly successEffect = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isSuccess),
      tap((action: any & TypedAction<string>) => {
        this.onSuccess();
      })
    );
  });

  private logError(error: HttpErrorResponse) {
    console.error(error);
  }
}
