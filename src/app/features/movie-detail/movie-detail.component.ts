import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MediaCredit,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { Observable } from 'rxjs';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { CastCrewListContainerComponent } from '../../shared/components/cast-crew-list-container/cast-crew-list-container.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { IMG_SIZES } from '../../providers';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    CastCrewListContainerComponent,
    ImgComponent,
  ],
  providers: [MovieDetailStore],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  protected readonly TMDB_PROFILE_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1X_IMG_URL
  );
  protected readonly TMDB_PROFILE_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_2X_IMG_URL
  );

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
