import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  RouterModule,
  RouterLinkActive,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { LifecycleMetadataSelectors } from '../../shared/store/lifecycle-metadata';
import { LifecycleTypeIdMap } from '../../shared/interfaces/store/lifecycle-metadata-state.interface';
import { LifecycleEnum } from '../../shared/enums/lifecycle.enum';
import {
  lifeCycleId,
  MovieLifecycleMap,
} from '../../shared/interfaces/lifecycle.interface';
import { Movie_Life_Cycle } from '../../shared/interfaces/supabase/entities';
import { Movie_Data } from '../../shared/interfaces/supabase/entities/movie_data.entity.interface';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';

@Component({
  selector: 'app-movie-lifecycle-lists',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  providers: [BridgeDataService],
  templateUrl: './movie-lifecycle-lists.component.html',
  styleUrl: './movie-lifecycle-lists.component.css',
})
export class MovieLifecycleListsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);

  destroyed$ = new Subject();

  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initBridgeData();
  }

  initSelectors() {
    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
    );

    this.store
      .select(MovieLifecycleSelectors.selectMovieList)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieListByLifecycle: Movie_Data[]) => {
        this.bridgeDataService.pushMediaListResultByLifecycle(
          movieListByLifecycle
        );
      });
  }

  initBridgeData() {
    //data to lifecycle-selector, lifecycle selected
    this.selectMovieLifecycleMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.inputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });

    this.bridgeDataService.lifecycleTypeSearchObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lifecycleType: string) => {
        this.searchMovieByLifecycle(lifecycleType);
      });
  }

  searchMovieByLifecycle(lifecycleType: string) {
    let lifecycleId = LifecycleEnum[lifecycleType];
    this.store.dispatch(
      MovieLifecycleActions.searchMovieByLifecycle({
        lifecycleId,
      })
    );
  }

  createUpdateDeleteMovieLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }
}
