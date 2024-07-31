import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MediaCredit,
  Movie,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { CastCrewListContainerComponent } from '../../shared/components/cast-crew-list-container/cast-crew-list-container.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { IMG_SIZES } from '../../providers';

import { MediaDetailContentComponent } from '../../shared/components/media-detail-content/media-detail-content.component';
import { PageEventService } from '../../shared/services/page-event.service';
import { MediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { Store } from '@ngrx/store';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';

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
  providers: [MovieDetailStore, BridgeDataService],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent extends MediaDetailComponent {
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly store = inject(Store);
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

  movieDetail$!: Observable<(MovieDetail & MediaCredit) | null>;
  isLoading$!: Observable<boolean>;

  @Input({ required: true })
  movieId: number = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.searchMovieDetail();
  }

  searchMovieDetail() {
    this.movieDetailstore.searchMovieDetail(this.movieId);
  }

  initSelectors() {
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
  }

  initDataBridge() {
    //data to lifecycle-selector, lifecycle selected
    this.store
      .select(MovieLifecycleSelectors.selectMovieLifecycleMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.movieInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });
  }

  createUpdateDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>
  ) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }
}
