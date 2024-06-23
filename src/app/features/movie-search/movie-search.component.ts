import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models';
import { MediaType, TV } from '../../shared/models/media.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.css',
})
export class MovieSearchComponent implements OnInit {
  mediaType: MediaType = 'movie';

  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMovieSelectors.selectIsLoading
  );

  selectMovieResult$: Observable<MovieResult> = this.store.select(
    SearchMovieSelectors.selectMovieResult
  );

  movie$: Observable<Movie[] | TV[]> = this.selectMovieResult$.pipe(
    map((movieResult) => {
      return movieResult.results;
    })
  );

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {}

  searchMovie(query: string) {
    this.store.dispatch(SearchMovieActions.searchMovie({ query }));
  }

  searchAdditionalMovie() {
    this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
  }
}
