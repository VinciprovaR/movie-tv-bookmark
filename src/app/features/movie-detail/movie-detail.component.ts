import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MediaType,
  MovieCredit,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { map, Observable, takeUntil } from 'rxjs';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { MediaDetailCastCrewListPreviewComponent } from '../../shared/components/media-detail-cast-crew-list-preview/media-detail-cast-crew-list-preview.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { MovieDetailMainInfoContentComponent } from '../../shared/components/movie-detail-main-info/movie-detail-main-info.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { LifecycleSelectorComponent } from '../../shared/components/lifecycle-selector/lifecycle-selector.component';
import { LifecycleStatusLabelComponent } from '../../shared/components/lifecycle-status-label/lifecycle-status-label.component';
import { lifecycleEnum } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { MatIconModule } from '@angular/material/icon';
import { ExternalInfoComponent } from '../../shared/components/external-info/external-info.component';
import { MediaKeywordsComponent } from '../../shared/components/media-keywords/media-keywords.component';
import { VideosContainerComponent } from '../../shared/components/videos-container/videos-container.component';
import {
  NavigationExtras,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MissingFieldPlaceholderComponent } from '../../shared/components/missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    MediaDetailCastCrewListPreviewComponent,
    ImgComponent,
    MovieDetailMainInfoContentComponent,
    LifecycleSelectorComponent,
    LifecycleStatusLabelComponent,
    MatIconModule,
    ExternalInfoComponent,
    VideosContainerComponent,
    MediaKeywordsComponent,
    RouterLink,
    RouterLinkActive,
    MissingFieldPlaceholderComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent
  extends AbstractMediaDetailComponent
  implements OnDestroy
{
  protected readonly bridgeDataService = inject(BridgeDataService);
  readonly movieDetailstore = inject(MovieDetailStore);

  movieDetail$!: Observable<MovieDetail | null>;
  isLoading$!: Observable<boolean>;

  @ViewChild('headerMediaDetail')
  headerMediaDetail!: ElementRef;
  @Input({ required: true })
  movieId: number = 0;

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';
  mediaType: MediaType = 'movie';

  movieCreditsPath: string = '';
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.movieCreditsPath = this.movieCreditsPath.concat(
      `/movie-credits/${this.movieId}`
    );
    this.initSelectors();
    this.initDataBridge();
    this.initSubscriptions();
    this.searchMovieDetail();
  }

  searchMovieDetail() {
    this.movieDetailstore.searchMovieDetail(this.movieId);
  }

  override initSelectors() {
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
  }

  override initSubscriptions() {
    this.movieDetail$
      .pipe(
        takeUntil(this.destroyed$),
        map((movieDetail: MovieDetail | null) => {
          return movieDetail?.backdrop_path ? movieDetail.backdrop_path : '';
        })
      )
      .subscribe((backdrop_path: string) => {
        this.evaluatePredominantColor(backdrop_path);
      });
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

  navigateToCredits(movieDetail: MovieDetail) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: movieDetail,
      },
    };

    this.router.navigate([this.movieCreditsPath], navigationExtras);
  }

  ngOnDestroy(): void {
    this.movieDetailstore.cleanMovieDetail();
  }
}
