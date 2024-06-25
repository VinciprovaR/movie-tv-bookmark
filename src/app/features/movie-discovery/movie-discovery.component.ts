import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  DiscoveryMovieActions,
  DiscoveryMovieSelectors,
} from '../../shared/store/discovery-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MovieResult, Movie } from '../../shared/models';
import { MediaType } from '../../shared/models/media.models';
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
  templateUrl: './movie-discovery.component.html',
  styleUrl: './movie-discovery.component.css',
})
export class MovieDiscoveryComponent implements OnInit {
  mediaType: MediaType = 'movie';

  selectIsLoading$: Observable<boolean> = this.store.select(
    DiscoveryMovieSelectors.selectIsLoading
  );

  selectMovieResult$: Observable<MovieResult> = this.store.select(
    DiscoveryMovieSelectors.selectMovieResult
  );

  movie$: Observable<Movie[]> = this.selectMovieResult$.pipe(
    map((movieResult) => {
      return movieResult.results;
    })
  );

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {}

  discoveryMovie(payload: any) {
    this.store.dispatch(DiscoveryMovieActions.discoveryMovie({ payload }));
  }

  discoveryAdditionalMovie() {
    this.store.dispatch(DiscoveryMovieActions.discoveryAdditionalMovie());
  }
}
