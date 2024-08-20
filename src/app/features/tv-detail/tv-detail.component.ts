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
import { TVDetailStore } from '../../shared/store/component-store/tv-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { MediaDetailCastCrewListPreviewComponent } from '../../shared/components/media-detail-cast-crew-list-preview/media-detail-cast-crew-list-preview.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { LifecycleSelectorComponent } from '../../shared/components/lifecycle-selector/lifecycle-selector.component';
import { LifecycleStatusLabelComponent } from '../../shared/components/lifecycle-status-label/lifecycle-status-label.component';
import { lifecycleEnum } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
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
    LifecycleSelectorComponent,
    LifecycleStatusLabelComponent,
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

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';
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
    //data to lifecycle-selector, lifecycle selected
    this.store
      .select(TVLifecycleSelectors.selectTVLifecycleMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(tvLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.tvInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteTVLifecycle(
          mediaLifecycleDTO as MediaLifecycleDTO<TVDetail>
        );
      });
  }

  createUpdateDeleteTVLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<TVDetail>
  ) {
    console.log(mediaLifecycleDTO);
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  setLifecycleStatusElement(lifecycleEnumSelected: lifecycleEnum) {
    this.lifecycleEnumSelected = lifecycleEnumSelected;
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
