import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { TMDB_RESIZED_IMG_URL } from '../../providers';
import {
  MediaCredit,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { Observable } from 'rxjs';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PeopleListContainerComponent } from '../../shared/components/people-list-container/people-list-container.component';
import { PeopleItemComponent } from '../../shared/components/people-item/people-item.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, PeopleListContainerComponent, PeopleItemComponent],
  providers: [MovieDetailStore],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  readonly resizedImgUrl = inject(TMDB_RESIZED_IMG_URL);
  readonly movieDetailstore = inject(MovieDetailStore);

  @Input({ required: true })
  movieId: number = 0;

  movieDetail$!: Observable<(MovieDetail & MediaCredit) | null>;
  isLoading$!: Observable<boolean>;
  constructor() {}

  ngOnInit(): void {
    this.initSelectors();
    this.searchMovieDetail();
  }

  searchMovieDetail() {
    this.movieDetailstore.searchMovieDetail(this.movieId);
  }

  initSelectors() {
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
  }
}
