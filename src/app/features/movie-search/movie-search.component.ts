import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import {
  MovieResult,
  Movie,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';

@Component({
  selector: 'app-search-movie',
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
  title = 'Movie Search';

  private readonly store = inject(Store);
  private readonly bridgeDataService = inject(BridgeDataService);

  movieListLength: number = 0;
  mediaType: MediaType = 'movie';

  destroyed$ = new Subject();

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  initDataBridge() {
    //data to lifecycle-selector, lifecycle selected
    this.store
      .select(MovieLifecycleSelectors.selectMovieLifecycleMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.movieInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });
  }

  initSelectors() {
    this.selectQuery$ = this.store.select(SearchMovieSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(
      SearchMovieSelectors.selectIsLoading
    );
    this.selectMovieList$ = this.store.select(
      SearchMovieSelectors.selectMovieList
    );
  }

  createUpdateDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>
  ) {
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
    this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
  }
}
