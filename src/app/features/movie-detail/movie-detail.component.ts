import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { Observable, map } from 'rxjs';
import { MediaType, MovieDetail } from '../../shared/models/media.models';
import { CommonModule } from '@angular/common';
import { TMDB_RESIZED_IMG_URL } from '../../providers';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  @Input()
  movieId: number = 0;
  resizedImgUrl: string = '';
  mediaType: MediaType = 'movie';
  movieDetail$: Observable<MovieDetail | null> = this.store.select(
    SearchMovieSelectors.selectMovieDetail
  );

  constructor(
    private store: Store,
    @Inject(TMDB_RESIZED_IMG_URL) private TMDB_RESIZED_IMG_URL: string
  ) {
    this.resizedImgUrl = TMDB_RESIZED_IMG_URL;
  }

  ngOnInit(): void {
    this.store.dispatch(
      SearchMovieActions.searchMovieDetail({
        movieId: this.movieId,
      })
    );
  }
}
