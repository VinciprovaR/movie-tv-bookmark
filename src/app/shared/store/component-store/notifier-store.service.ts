import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Alert, notificationType } from '../../interfaces/alert.interface';
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
  private readonly ALERT_MESSAGE_MAP: any = {
    update: 'Bookmark updated!',
    createUpdate: 'Bookmark added!',
    delete: 'Bookmark deleted!',
    create: 'Bookmark added!',
    unchanged: 'Bookmark updated!',
  };

  readonly isFailure = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return type.toLowerCase().includes('failure');
  };

  readonly isSuccessOrNotify = (action: any & TypedAction<string>) => {
    let { type }: { type: string } = action;
    return (
      type.toLowerCase().includes('success') &&
      type.toLowerCase().includes('notify')
    );
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

    return { ...state, alerts: [newAlert, ...state.alerts] };
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
        let msg = "Errore, non è stato possibile eseguire l'operazione";
        this.notify(action, msg, 'error');
      })
    );
  });

  readonly showAlertSuccess = this.effect(() => {
    return this.actions$.pipe(
      filter(this.isSuccessOrNotify),
      tap((action: any & TypedAction<string>) => {
        let { operation, type }: { operation: string; type: string } = action;
        let msg = `${type.toLowerCase().includes('movie') ? 'Movie' : 'TV'} ${
          this.ALERT_MESSAGE_MAP[operation]
        }`;
        this.notify(action, msg, 'success');
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
