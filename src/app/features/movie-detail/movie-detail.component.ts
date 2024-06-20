import { Component, Inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-media';
import { Observable } from 'rxjs';
import { MovieDetail } from '../../shared/models';
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
      SearchMovieActions.searchMovieDetail({ movieId: this.movieId })
    );
  }
}
