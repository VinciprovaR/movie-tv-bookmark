import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Alert, notificationType } from '../interfaces/alert.interface';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
//to-do refractor in state globale (?)
export interface AlertState {
  alerts: Alert[];
}

@Injectable({ providedIn: 'root' })
export class NotifierStore extends ComponentStore<AlertState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);

  readonly selectAlerts$ = this.select((state) => state.alerts);
  //to-do i18e + refractor
  readonly isFailure = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('failure');
  };

  readonly isLoading = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('is loading');
  };

  readonly isNotify = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('notify');
  };
  constructor() {
    super({ alerts: [] });
  }

  readonly addAlert = this.updater((state, alert: Alert) => {
    const newAlert = {
      id: alert.id,
      message: alert.message,
      type: alert.type,
    };

    return { ...state, alerts: [...state.alerts, newAlert] };
  });

  readonly removeAlert = this.updater((state, id: number) => {
    return { alerts: state.alerts.filter((alert) => alert.id !== id) };
  });

  readonly cleanAlerts = this.updater((state) => {
    return { alerts: [] };
  });

  readonly showAlertError = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isFailure),
      tap((action: any & TypedAction<string>) => {
        let msg = 'Error, something went wrong';
        this.notify(action, msg, 'error');
      })
    );
  });

  readonly showAlertSuccess = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isNotify),
      tap((action: any & TypedAction<string>) => {
        if (action['notifyMsg']) {
          this.notify(action, action['notifyMsg'], 'success');
        }
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

  //to-do i18e + refractor
  private notify(
    action: any & TypedAction<string>,
    message: string,
    type: notificationType
  ) {
    if (type === 'error') this.logError(action.httpErrorResponse);

    this.addAlert({
      message,
      type,
      id: new Date().getTime(),
    });
  }

  private logError(error: HttpErrorResponse) {
    console.error(error);
  }
}
