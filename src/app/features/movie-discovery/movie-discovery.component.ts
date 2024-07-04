import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';
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
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';

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
  providers: [BridgeDataService],
  templateUrl: './movie-discovery.component.html',
  styleUrl: './movie-discovery.component.css',
})
export class MovieDiscoveryComponent implements OnInit {
  movieListLength: number = 0;

  destroyed$ = new Subject();

  mediaType: MediaType = 'movie';

  signalAdditionalMovie$: Subject<void> = new Subject();
  signalAdditionalMovieObs$: Observable<void> =
    this.signalAdditionalMovie$.asObservable();

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
      this.movieListLength = movieResult.results.length;
      return movieResult.results;
    })
  );

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}

  ngOnInit(): void {
    //data to lifecycle-selector, options
    this.supabaseLifecycleService.lifeCycleOptions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lifecycleOptions) => {
        this.bridgeDataService.pushSelectLifecycleOptions(lifecycleOptions);
      });

    //data to lifecycle-selector, lifecycle selected
    this.store
      .select(MovieLifecycleSelectors.selectMovieLifecycleMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.inputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        //this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
        this.createUpdateDeleteMovieLifecycleSeparated(mediaLifecycleDTO);
      });
    this.populateGenreList();
  }

  populateGenreList() {
    this.store.dispatch(DiscoveryMovieActions.getGenreList());
  }

  //Nuovo flusso
  createUpdateDeleteMovieLifecycleSeparated(
    mediaLifecycleDTO: MediaLifecycleDTO
  ) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  createUpdateDeleteMovieLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
    console.log('createUpdateDeleteMovieLifecycle');
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
    if (this.movieListLength > 0) {
      this.signalAdditionalMovie$.next();
    }
  }

  discoveryAdditionalMovieWithFilters(payload: PayloadDiscoveryMovie) {
    this.store.dispatch(
      DiscoveryMovieActions.discoveryAdditionalMovie({ payload })
    );
  }
}
