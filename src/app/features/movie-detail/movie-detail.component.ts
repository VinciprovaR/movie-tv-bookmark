import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MediaCredit,
  Movie,
  MovieDetail,
  ReleaseDate,
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
import { LifecycleSelectorComponent } from '../../shared/components/lifecycle-selector/lifecycle-selector.component';
import { LifecycleStatusLabelComponent } from '../../shared/components/lifecycle-status-label/lifecycle-status-label.component';
import { lifecycleEnum } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { FastAverageColorResult } from 'fast-average-color';
import { PredominantImgColorService } from '../../shared/predominant-img-color.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    CastCrewListContainerComponent,
    ImgComponent,
    MediaDetailContentComponent,
    LifecycleSelectorComponent,
    LifecycleStatusLabelComponent,
  ],
  providers: [MovieDetailStore, BridgeDataService],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent
  extends MediaDetailComponent
  implements AfterViewInit
{
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
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly destroyRef$ = inject(DestroyRef);
  readonly predominantImgColorService = inject(PredominantImgColorService);

  destroyed$ = new Subject();
  movieDetail$!: Observable<(MovieDetail & MediaCredit & ReleaseDate) | null>;
  isLoading$!: Observable<boolean>;

  @ViewChild('headerMediaDetail')
  headerMediaDetail!: ElementRef;

  @Input({ required: true })
  movieId: number = 0;

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';
  isGradientColorLoaded: boolean = false;

  constructor() {
    super();
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  ngAfterViewInit(): void {
    this.initSelectors();
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.initDataBridge();
    this.searchMovieDetail();
  }

  searchMovieDetail() {
    this.movieDetailstore.searchMovieDetail(this.movieId);
  }

  initSelectors() {
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
    this.movieDetail$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (movieDetail: (MovieDetail & MediaCredit & ReleaseDate) | null) => {
          if (movieDetail?.backdrop_path) {
            this.setMediaHeaderGradient(movieDetail.backdrop_path);
          }
        }
      );
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
        this.createUpdateDeleteMovieLifecycle(
          mediaLifecycleDTO as MediaLifecycleDTO<MovieDetail>
        );
      });
  }

  createUpdateDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<MovieDetail>
  ) {
    console.log(mediaLifecycleDTO);
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  setLifecycleStatusElement(lifecycleEnumSelected: lifecycleEnum) {
    this.lifecycleEnumSelected = lifecycleEnumSelected;
  }

  setMediaHeaderGradient(backdropPath: string) {
    this.predominantImgColorService
      .evaluatePredominantColor(backdropPath)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((colorResult: FastAverageColorResult) => {
        this.renderer.setStyle(
          this.headerMediaDetail.nativeElement,
          'background-image',
          `linear-gradient(to bottom, rgba(${colorResult.value[0]},${colorResult.value[1]},${colorResult.value[2]}, 0.65), rgba(${colorResult.value[0]},${colorResult.value[1]},${colorResult.value[2]}, 0.54))`
        );
        this.renderer.removeClass(
          this.headerMediaDetail.nativeElement,
          'backdrop-blur-xl'
        );
      });
  }
}
