import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, defaultIfEmpty, filter, map } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-media';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models';
import { MediaType } from '../../shared/models/media.models';

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

  selectMoviesResult$: Observable<MovieResult> = this.store.select(
    SearchMovieSelectors.selectMoviesResult
  );

  movies$: Observable<Movie[]> = this.selectMoviesResult$.pipe(
    map((movieResult) => {
      return movieResult.results;
    })
  );

  constructor(private store: Store) {}

  ngOnInit(): void {}

  searchMovie(query: string) {
    this.store.dispatch(
      SearchMovieActions.searchMedia({ query, mediaType: this.mediaType })
    );
  }

  searchAdditionalMovie() {
    this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
  }
}
