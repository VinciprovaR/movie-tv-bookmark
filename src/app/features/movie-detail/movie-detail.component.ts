import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MediaType,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { map, Observable, takeUntil } from 'rxjs';
import { MovieDetailStore } from '../../shared/component-store';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { MediaDetailCastCrewListPreviewComponent } from '../../shared/components/media-detail-cast-crew-list-preview/media-detail-cast-crew-list-preview.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { MovieDetailMainInfoContentComponent } from '../../shared/components/movie-detail-main-info/movie-detail-main-info.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieBookmarkActions,
  MovieBookmarkSelectors,
} from '../../shared/store/movie-bookmark';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { BookmarkSelectorComponent } from '../../shared/components/bookmark-selector/bookmark-selector.component';
import { BookmarkStatusLabelComponent } from '../../shared/components/bookmark-status-label/bookmark-status-label.component';
import { bookmarkEnum } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
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
import { AuthSelectors } from '../../shared/store/auth';
import { BookmarkDisabledDialogComponent } from '../../shared/components/bookmark-disabled-confirmation-dialog/bookmark-disabled-dialog.component';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { ErrorMessageTemplateComponent } from '../../shared/components/error-message-template/error-message-template.component';
import { PredominantColor } from '../../shared/interfaces/layout.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    MediaDetailCastCrewListPreviewComponent,
    ImgComponent,
    MovieDetailMainInfoContentComponent,
    BookmarkSelectorComponent,
    BookmarkStatusLabelComponent,
    MatIconModule,
    ExternalInfoComponent,
    VideosContainerComponent,
    MediaKeywordsComponent,
    RouterLink,
    RouterLinkActive,
    MissingFieldPlaceholderComponent,
    BookmarkDisabledDialogComponent,
    ErrorMessageTemplateComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent
  extends AbstractMediaDetailComponent
  implements OnDestroy
{
  protected readonly bridgeDataService = inject(BridgeDataService);
  readonly movieDetailstore = inject(MovieDetailStore);
  movieDetail$!: Observable<MovieDetail | null>;
  isLoading$!: Observable<boolean>;
  isUserAuthenticated$!: Observable<boolean>;
  error$!: Observable<CustomHttpErrorResponseInterface | null>;
  @ViewChild('headerMediaDetail')
  headerMediaDetail!: ElementRef;
  @Input({ required: true })
  movieId: number = 0;
  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this movie detail you're searching for doesn't exist.`;
  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';
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

  initSelectors() {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
    this.error$ = this.movieDetailstore.selectError$;
  }

  initSubscriptions() {
    this.predominantImgColorService.getPredominantColorObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((predominantColor: PredominantColor) => {
        this.isDark = predominantColor.isDark;
        this.textColorBlend = predominantColor.textColorBlend;
        this.headerMediaGradient = predominantColor.headerMediaGradient;
        this.detectChanges();
      });

    this.movieDetail$
      .pipe(
        takeUntil(this.destroyed$),
        map((movieDetail: MovieDetail | null) => {
          return movieDetail?.backdrop_path ? movieDetail.backdrop_path : '';
        })
      )
      .subscribe((backdrop_path: string) => {
        this.predominantImgColorService.evaluatePredominantColor(backdrop_path);
      });
  }

  initDataBridge() {
    //data to bookmark-selector, bookmark selected
    this.store
      .select(MovieBookmarkSelectors.selectMovieBookmarkMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(movieBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.movieInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteMovieBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<MovieDetail>
        );
      });
  }

  createUpdateDeleteMovieBookmark(
    mediaBookmarkDTO: MediaBookmarkDTO<MovieDetail>
  ) {
    this.store.dispatch(
      MovieBookmarkActions.createUpdateDeleteMovieBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    this.bookmarkEnumSelected = bookmarkEnumSelected;
  }

  navigateToCredits(movieDetail: MovieDetail) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: movieDetail,
      },
    };

    this.router.navigate([this.movieCreditsPath], navigationExtras);
  }

  getNavigationExtra(movieDetail: MovieDetail) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: movieDetail,
      },
    };

    return navigationExtras;
  }

  ngOnDestroy(): void {
    this.movieDetailstore.cleanMovieDetail();
  }
}
