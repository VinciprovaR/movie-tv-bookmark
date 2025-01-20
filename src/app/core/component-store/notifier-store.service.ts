import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import {
  Alert,
  AlertState,
  notificationType,
} from '../../shared/interfaces/alert.interface';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';

@Injectable({ providedIn: 'root' })
export class NotifierStore extends ComponentStore<AlertState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);

  readonly selectAlerts$ = this.select((state) => state.alerts);

  readonly isFailure = (action: any) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('failure');
  };

  readonly isNotify = (action: any) => {
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
      tap(
        (action: {
          httpErrorResponse: CustomHttpErrorResponseInterface;
          type: Action;
        }) => {
          let msg = action.httpErrorResponse.message
            ? action.httpErrorResponse.message
            : 'Error, something went wrong';
          this.notify(msg, 'error');
        }
      )
    );
  });

  readonly showAlertSuccess = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isNotify),
      tap((action: any) => {
        if (action['notifyMsg']) {
          this.notify(action['notifyMsg'], 'success');
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

  private notify(message: string, type: notificationType) {
    this.addAlert({
      message,
      type,
      id: new Date().getTime(),
    });
  }
}
