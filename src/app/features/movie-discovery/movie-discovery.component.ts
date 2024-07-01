import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  DiscoveryMovieActions,
  DiscoveryMovieSelectors,
} from '../../shared/store/discovery-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models/media.models';
import { MediaType } from '../../shared/models/media.models';
import { Router } from '@angular/router';
import { DiscoveryFiltersComponent } from '../../shared/components/discovery-filters/discovery-filters.component';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../shared/models/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryMovie } from '../../shared/models/store/discovery-movie-state.models';
import { Genre } from '../../shared/models/tmdb-filters.models';
import { SupabaseLifecycleService } from '../../shared/services/supabase';

@Component({
  selector: 'app-movie-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
    DiscoveryFiltersComponent,
  ],
  templateUrl: './movie-discovery.component.html',
  styleUrl: './movie-discovery.component.css',
})
export class MovieDiscoveryComponent implements OnInit {
  destroyed$ = new Subject();

  mediaType: MediaType = 'movie';

  payload$: Observable<PayloadDiscoveryMovie> = this.store.select(
    DiscoveryMovieSelectors.selectPayload
  );

  selectIsLoading$: Observable<boolean> = this.store.select(
    DiscoveryMovieSelectors.selectIsLoading
  );

  selectMovieResult$: Observable<MovieResult> = this.store.select(
    DiscoveryMovieSelectors.selectMovieResult
  );

  selectGenreList$: Observable<Genre[] | []> = this.store.select(
    DiscoveryMovieSelectors.selectGenreList
  );

  movie$: Observable<Movie[]> = this.selectMovieResult$.pipe(
    map((movieResult) => {
      return movieResult.results;
    })
  );

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}

  ngOnInit(): void {
    //data to lifecycle-selector
    this.supabaseLifecycleService.lifeCycleOptions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lifecycleOptions) => {
        this.bridgeDataService.pushSelectLifecycleOptions(lifecycleOptions);
      });

    // data from lifecycle-selector
    this.bridgeDataService.inputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });
    this.populateGenreList();
  }

  populateGenreList() {
    this.store.dispatch(DiscoveryMovieActions.getGenreList());
  }

  createUpdateDeleteMovieLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.store.dispatch(
      DiscoveryMovieActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  discoveryMovie(payload: any) {
    this.store.dispatch(
      DiscoveryMovieActions.discoveryMovie({
        payload: payload,
      })
    );
  }

  discoveryAdditionalMovie() {
    this.store.dispatch(DiscoveryMovieActions.discoveryAdditionalMovie());
  }
}
