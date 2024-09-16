import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { DiscoveryTVActions, DiscoveryTVSelectors } from '../../../../core/store/discovery-tv';
import { FiltersMetadataSelectors } from '../../../../core/store/filters-metadata';
import { TVBookmarkActions, TVBookmarkSelectors } from '../../../../core/store/tv-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { InputQueryComponent } from '../../../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { PayloadDiscoveryTV } from '../../../../shared/interfaces/store/discovery-tv-state.interface';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { TVBookmarkMap } from '../../../../shared/interfaces/supabase/supabase-bookmark.interface';
import { Certification, Genre, Language, OptionFilter } from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';
import { MediaType, TV } from '../../../../shared/interfaces/TMDB/tmdb-media.interface';
import { TVDiscoveryFiltersComponent } from '../tv-discovery-filters/tv-discovery-filters.component';

@Component({
  selector: 'app-tv-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    TVDiscoveryFiltersComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-discovery.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDiscoveryComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  private readonly bridgeDataService = inject(BridgeDataService);
  selectIsLoading$!: Observable<boolean>;
  selectNoAdditional$!: Observable<boolean>;
  selectIsFirstLanding$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;
  selectTVBookmarkMap$!: Observable<TVBookmarkMap>;
  selectCombinedDiscoveryFilters$!: Observable<[PayloadDiscoveryTV, Genre[]]>;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;
  title = 'TV Discovery';
  mediaType: MediaType = 'tv';
  isFirstLanding: boolean = true;

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    if (this.isFirstLanding) {
      this.discoveryTVLanding();
    }
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.initSubscriptions();
  }

  initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryTVSelectors.selectIsLoading
    );

    this.selectIsFirstLanding$ = this.store.select(
      DiscoveryTVSelectors.selectIsFirstLanding
    );

    this.selectTVBookmarkMap$ = this.store.select(
      TVBookmarkSelectors.selectTVBookmarkMap
    );

    this.selectTVList$ = this.store.select(DiscoveryTVSelectors.selectTVList);

    this.selectCombinedDiscoveryFilters$ = combineLatest([
      this.store.select(DiscoveryTVSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListTV),
    ]);

    this.selectLanguageList$ = this.store.select(
      FiltersMetadataSelectors.selectLanguageListMedia
    );

    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByDiscoveryTV
    );
    this.selectNoAdditional$ = this.store.select(
      DiscoveryTVSelectors.selectNoAdditional
    );
  }

  initSubscriptions() {
    this.selectIsFirstLanding$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isFirstLanding: boolean) => {
        this.isFirstLanding = isFirstLanding;
      });
  }

  initDataBridge() {
    //data to bookmark-selector, bookmark selected
    this.selectTVBookmarkMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(tvBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.tvInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteTVBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<TV>
        );
      });
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }
  discoveryTVLanding() {
    this.store.dispatch(DiscoveryTVActions.discoveryTVLanding());
  }

  discoveryTV(payload: PayloadDiscoveryTV) {
    this.store.dispatch(
      DiscoveryTVActions.discoveryTV({
        payload: payload,
      })
    );
  }

  discoveryAdditionalTV() {
    this.store.dispatch(DiscoveryTVActions.discoveryAdditionalTV());
  }
}
