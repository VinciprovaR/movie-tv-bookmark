import { Component, DestroyRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MediaCredit,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { debounceTime, fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { CastCrewListContainerComponent } from '../../shared/components/cast-crew-list-container/cast-crew-list-container.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { IMG_SIZES } from '../../providers';

import { MediaDetailContentComponent } from '../../shared/components/media-detail-content/media-detail-content.component';
import { PageEventService } from '../../shared/services/page-event.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    CastCrewListContainerComponent,
    ImgComponent,

    MediaDetailContentComponent,
  ],
  providers: [MovieDetailStore],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  readonly TMDB_PROFILE_1X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_1X_IMG_URL);
  readonly TMDB_PROFILE_2X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_2X_IMG_URL);
  readonly TMDB_MULTI_FACE_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_MULTI_FACE_1X_IMG_URL
  );
  readonly TMDB_MULTI_FACE_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_MULTI_FACE_2X_IMG_URL
  );
  readonly TMDB_ORIGINAL_IMG_URL = inject(IMG_SIZES.TMDB_ORIGINAL_IMG_URL);

  readonly movieDetailstore = inject(MovieDetailStore);
  readonly pageEventService = inject(PageEventService);

  destroyed$ = new Subject();

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
