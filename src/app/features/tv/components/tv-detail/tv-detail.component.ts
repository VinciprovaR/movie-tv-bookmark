import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationExtras } from '@angular/router';
import { map, Observable, takeUntil } from 'rxjs';
import { TVDetailStore } from '../../../../core/component-store/tv-detail-store.service';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { AuthSelectors } from '../../../../core/store/auth';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../../../core/store/tv-bookmark';
import { AbstractMediaDetailComponent } from '../../../../shared/abstract/components/abstract-media-detail.component';
import { BookmarkComponent } from '../../../../shared/components/bookmark/bookmark.component';
import { ErrorMessageTemplateComponent } from '../../../../shared/components/error-message-template/error-message-template.component';
import { ExternalInfoComponent } from '../../../../shared/components/external-info/external-info.component';
import { ImgComponent } from '../../../../shared/components/img/img.component';
import { MediaDetailCastCrewListPreviewComponent } from '../../../../shared/components/media-detail-cast-crew-list-preview/media-detail-cast-crew-list-preview.component';
import { MediaKeywordsComponent } from '../../../../shared/components/media-keywords/media-keywords.component';
import { TVDetailMainInfoComponent } from '../../../../shared/components/tv-detail-main-info/tv-detail-main-info.component';
import { VideosContainerComponent } from '../../../../shared/components/videos-container/videos-container.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import { PredominantColor } from '../../../../shared/interfaces/layout.interface';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { bookmarkEnum } from '../../../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  TVDetail,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-tv-detail',
  standalone: true,
  imports: [
    CommonModule,
    MediaDetailCastCrewListPreviewComponent,
    ImgComponent,
    TVDetailMainInfoComponent,
    BookmarkComponent,
    MatIconModule,
    ExternalInfoComponent,
    VideosContainerComponent,
    MediaKeywordsComponent,
    ErrorMessageTemplateComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-detail.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDetailComponent
  extends AbstractMediaDetailComponent
  implements OnInit, OnDestroy
{
  protected readonly bridgeDataService = inject(BridgeDataService);
  readonly tvDetailstore = inject(TVDetailStore);

  tvDetail$!: Observable<TVDetail | null>;
  isLoading$!: Observable<boolean>;
  isUserAuthenticated$!: Observable<boolean>;
  error$!: Observable<CustomHttpErrorResponseInterface | null>;

  @ViewChild('headerMediaDetail')
  headerMediaDetail!: ElementRef;

  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this tv detail you're searching for doesn't exist.`;

  @Input({ required: true })
  tvId: number = 0;

  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';
  tvCreditsPath: string = '';

  mediaType: MediaType = 'tv';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.tvCreditsPath = this.tvCreditsPath.concat(`/tv-credits/${this.tvId}`);

    this.initSelectors();
    this.initDataBridge();
    this.initSubscriptions();
    this.searchTVDetail();
  }

  initSelectors() {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
    this.error$ = this.tvDetailstore.selectError$;
  }

  initSubscriptions(): void {
    this.predominantImgColorService.getPredominantColorObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((predominantColor: PredominantColor) => {
        this.isDark = predominantColor.isDark;
        this.textColorBlend = predominantColor.textColorBlend;
        this.headerMediaGradient = predominantColor.headerMediaGradient;
        this.contentMediaGradient = predominantColor.contentMediaGradient;
        this.detectChanges();
      });

    this.tvDetail$
      .pipe(
        takeUntil(this.destroyed$),
        map((tvDetail: TVDetail | null) => {
          return tvDetail?.backdrop_path ? tvDetail.backdrop_path : '';
        })
      )
      .subscribe((backdrop_path: string) => {
        this.predominantImgColorService.evaluatePredominantColor(backdrop_path);
      });
  }
  initDataBridge() {
    //data to bookmark-selector, bookmark selected
    this.store
      .select(TVBookmarkSelectors.selectTVBookmarkMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(tvBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.tvInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteTVBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<TVDetail>
        );
      });
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TVDetail>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    this.bookmarkEnumSelected = bookmarkEnumSelected;
  }

  navigateToCredits(tVDetail: TVDetail) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: tVDetail,
      },
    };

    this.router.navigate([this.tvCreditsPath], navigationExtras);
  }

  searchTVDetail() {
    this.tvDetailstore.searchTVDetail(this.tvId);
  }

  ngOnDestroy(): void {
    this.tvDetailstore.cleanTVDetail();
  }
}
