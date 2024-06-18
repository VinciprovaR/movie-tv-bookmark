import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MediaTitleSearchComponent } from '../../shared/components/media-title-search/media-title-search.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, defaultIfEmpty, filter, map } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models';
import { MediaType } from '../../shared/models/media.models';
@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    MediaTitleSearchComponent,
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

  searchMovie$: Subject<string> = new Subject<string>();
  changeLifecycle$: Subject<any> = new Subject<{
    mediaId: number;
    lifeCycleId: number;
    index: number;
  }>();

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.searchMovie$.subscribe((query) => {
      this.store.dispatch(SearchMovieActions.searchMovie({ query }));
    });

    this.changeLifecycle$.subscribe(
      (lifecycle: { mediaId: number; index: number }) => {
        // this.store.dispatch(
        //   SearchMovieActions.changeMovieLifecycle({ lifecycle })
        // );
      }
    );
  }

  // searchMovie(query: string) {
  //   this.store.dispatch(SearchMovieActions.searchMovie({ query }));
  // }

  searchAdditionalMovie() {
    this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
  }
}
