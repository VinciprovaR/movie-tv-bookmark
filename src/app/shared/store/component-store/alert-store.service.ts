import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SearchMovieActions } from '../search-movie';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieLifecycleActions } from '../movie-lifecycle';
import { TVLifecycleActions } from '../tv-lifecycle';
import { Alert } from '../../interfaces/alert.interface';
import { Store } from '@ngrx/store';
import { AuthActions } from '../auth';
import { DiscoveryMovieActions } from '../discovery-movie';
import { DiscoveryTVActions } from '../discovery-tv';
import { FiltersMetadataActions } from '../filters-metadata';
import { LifecycleMetadataActions } from '../lifecycle-metadata';
import { SearchTVActions } from '../search-tv';
import { movieDetailFailure } from './movie-detail-store.service';
import { tvDetailFailure } from './tv-detail-store.service';

export interface AlertState {
  alerts: Alert[];
}

@Injectable()
export class AlertStore extends ComponentStore<AlertState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);

  readonly selectAlerts$ = this.select((state) => state.alerts);
  //to-do i18e
  private readonly ALERT_MESSAGE_MAP: any = {
    update: 'lifecycle aggiornato',
    createUpdate: 'lifecycle aggiunto',
    delete: 'lifecycle rimosso',
    create: 'lifecycle aggiunto',
    unchanged: 'lifecycle aggiornato',
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

  //to-do action errore generalizzata nel notificator state quando lo refrorerai, ogni sotto stato raggruppa tutte le sue failure e chiama failure global (?)
  readonly showAlertError = this.effect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.authFailure,
        SearchMovieActions.searchMovieFailure,
        SearchTVActions.searchTVFailure,
        DiscoveryMovieActions.discoveryMovieFailure,
        DiscoveryTVActions.discoveryTVFailure,
        FiltersMetadataActions.filtersMetadataFailure,
        LifecycleMetadataActions.lifecycleMetadataFailure,
        MovieLifecycleActions.lifecycleFailure,
        MovieLifecycleActions.createMovieLifecycleFailure,
        MovieLifecycleActions.deleteMovieLifecycleFailure,
        MovieLifecycleActions.updateMovieLifecycleFailure,
        MovieLifecycleActions.unchangedMovieLifecycleFailure,
        TVLifecycleActions.lifecycleFailure,
        TVLifecycleActions.createTVLifecycleFailure,
        TVLifecycleActions.deleteTVLifecycleFailure,
        TVLifecycleActions.updateTVLifecycleFailure,
        TVLifecycleActions.unchangedTVLifecycleFailure,
        movieDetailFailure,
        tvDetailFailure
      ),
      tap((action) => {
        let { httpErrorResponse }: { httpErrorResponse: HttpErrorResponse } =
          action;

        this.handleError(httpErrorResponse);

        this.addAlert({
          message: "Errore, non è stato possibile eseguire l'operazione",
          type: 'error',
          id: new Date().getTime(),
        });
      })
    );
  });

  readonly showAlertMovieLifecycleSuccess = this.effect(() => {
    return this.actions$.pipe(
      ofType(
        MovieLifecycleActions.createMovieLifecycleSuccess,
        MovieLifecycleActions.updateMovieLifecycleSuccess,
        MovieLifecycleActions.deleteMovieLifecycleSuccess,
        MovieLifecycleActions.unchangedMovieLifecycleSuccess
      ),
      tap((action) => {
        let { operation } = action;
        this.addAlert({
          message: `Movie ${this.ALERT_MESSAGE_MAP[operation]}`,
          type: 'success',
          id: new Date().getTime(),
        });
      })
    );
  });

  readonly showAlertTVLifecycleSuccess = this.effect(() => {
    return this.actions$.pipe(
      ofType(
        TVLifecycleActions.createTVLifecycleSuccess,
        TVLifecycleActions.updateTVLifecycleSuccess,
        TVLifecycleActions.deleteTVLifecycleSuccess,
        TVLifecycleActions.unchangedTVLifecycleSuccess
      ),
      tap((action) => {
        let { operation } = action;
        this.addAlert({
          message: `TV ${this.ALERT_MESSAGE_MAP[operation]}`,
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

  handleError(error: HttpErrorResponse) {
    console.error(error);
  }
}
