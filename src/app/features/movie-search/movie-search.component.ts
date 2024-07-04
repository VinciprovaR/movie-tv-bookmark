import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models/media.models';
import { MediaType } from '../../shared/models/media.models';
import { Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../shared/models/supabase/DTO';
import { SupabaseLifecycleService } from '../../shared/services/supabase';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.css',
})
export class MovieSearchComponent implements OnInit {
  movieListLength: number = 0;

  destroyed$ = new Subject();

  mediaType: MediaType = 'movie';

  query$ = this.store.select(SearchMovieSelectors.selectQuery);

  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMovieSelectors.selectIsLoading
  );

  selectMovieResult$: Observable<MovieResult> = this.store.select(
    SearchMovieSelectors.selectMovieResult
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
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

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
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });

    // this.searchMovie(this.query);
  }

  createUpdateDeleteMovieLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  searchMovie(query: string) {
    this.store.dispatch(SearchMovieActions.searchMovie({ query }));
  }

  searchAdditionalMovie() {
    if (this.movieListLength > 0) {
      this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
    }
  }
}
