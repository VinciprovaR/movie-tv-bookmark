import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MediaType,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { map, Observable, takeUntil } from 'rxjs';
import { TVDetailStore } from '../../shared/component-store';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { MediaDetailCastCrewListPreviewComponent } from '../../shared/components/media-detail-cast-crew-list-preview/media-detail-cast-crew-list-preview.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../shared/store/tv-bookmark';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { BookmarkSelectorComponent } from '../../shared/components/bookmark-selector/bookmark-selector.component';
import { BookmarkStatusLabelComponent } from '../../shared/components/bookmark-status-label/bookmark-status-label.component';
import { bookmarkEnum } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import { MatIconModule } from '@angular/material/icon';
import { ExternalInfoComponent } from '../../shared/components/external-info/external-info.component';
import { MediaKeywordsComponent } from '../../shared/components/media-keywords/media-keywords.component';
import { VideosContainerComponent } from '../../shared/components/videos-container/videos-container.component';
import { TVDetailMainInfoContentComponent } from '../../shared/components/tv-detail-main-info/tv-detail-main-info.component';
import { NavigationExtras } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tv-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonListContainerComponent,
    MediaDetailCastCrewListPreviewComponent,
    ImgComponent,
    TVDetailMainInfoContentComponent,
    BookmarkSelectorComponent,
    BookmarkStatusLabelComponent,
    MatIconModule,
    ExternalInfoComponent,
    VideosContainerComponent,
    MediaKeywordsComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-detail.component.html',
  styleUrl: './tv-detail.component.css',
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

  @ViewChild('headerMediaDetail')
  headerMediaDetail!: ElementRef;
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
    this.searchTVDetail();
  }

  override initSelectors() {
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
    this.tvDetail$
      .pipe(
        takeUntil(this.destroyed$),
        map((tvDetail: TVDetail | null) => {
          return tvDetail?.backdrop_path ? tvDetail.backdrop_path : '';
        })
      )
      .subscribe((backdrop_path: string) => {
        this.evaluatePredominantColor(backdrop_path);
      });
  }

  override initSubscriptions(): void {}
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
    console.log(mediaBookmarkDTO);
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
