import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SearchMovieActions } from '../search-movie';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieLifecycleActions } from '../movie-lifecycle';
import {
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TVLifecycleActions } from '../tv-lifecycle';

export interface Alert {
  id: number;
  message: string;
  type: 'error' | 'success';
}

export interface AlertState {
  alerts: Alert[];
}

@Injectable({ providedIn: 'root' })
export class AlertStore extends ComponentStore<AlertState> {
  readonly actions$ = inject(Actions);

  constructor() {
    super({ alerts: [] });
  }

  readonly alerts$ = this.select((state) => state.alerts);

  readonly addAlert = this.updater((state, alert: Alert) => {
    const newAlert = {
      id: alert.id,
      message: alert.message + ' ' + alert.id,
      type: alert.type,
    };
    return { ...state, alerts: [newAlert, ...state.alerts] };
  });

  readonly removeAlert = this.updater((state, id: number) => {
    return { alerts: state.alerts.filter((alert) => alert.id !== id) };
  });

  readonly showAlertError = this.effect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovieFailure),
      tap((action) => {
        let { httpErrorResponse }: { httpErrorResponse: HttpErrorResponse } =
          action;
        this.addAlert({
          message: httpErrorResponse.message,
          type: 'error',
          id: new Date().getTime(),
        });
      })
    );
  });
  //to-do mappare tipo azione precisa e movie name
  readonly showAlertSuccess = this.effect(() => {
    return this.actions$.pipe(
      ofType(
        MovieLifecycleActions.createUpdateDeleteMovieLifecycleSuccess,
        TVLifecycleActions.createUpdateDeleteTVLifecycleSuccess
      ),

      tap((action) => {
        let { typeAction }: { typeAction: string } = action;
        this.addAlert({
          message: 'CRUD lifecycle ' + typeAction,
          type: 'success',
          id: new Date().getTime(),
        });
      })
    );
  });

  readonly closeAlert = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      tap((id) => {
        this.removeAlert(id);
      })
    );
  });
}
