import { Component, Inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SearchMediaActions,
  SearchMediaSelectors,
} from '../../shared/store/search-media';
import { Observable, map } from 'rxjs';
import { MediaType, MovieDetail, TVDetail } from '../../shared/models';
import { CommonModule } from '@angular/common';
import { TMDB_RESIZED_IMG_URL } from '../../providers';

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  @Input()
  mediaId: number = 0;
  resizedImgUrl: string = '';
  mediaType: MediaType = 'movie';
  movieDetail$: Observable<MovieDetail | null> = this.store.select(
    SearchMediaSelectors.selectMovieDetail
  );

  constructor(
    private store: Store,
    @Inject(TMDB_RESIZED_IMG_URL) private TMDB_RESIZED_IMG_URL: string
  ) {
    this.resizedImgUrl = TMDB_RESIZED_IMG_URL;
  }

  ngOnInit(): void {
    this.store.dispatch(
      SearchMediaActions.searchMediaDetail({
        mediaId: this.mediaId,
        mediaType: this.mediaType,
      })
    );
  }
}
