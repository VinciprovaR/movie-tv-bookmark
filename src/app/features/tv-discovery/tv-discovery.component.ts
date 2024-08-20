import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';

import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import {
  DiscoveryTVActions,
  DiscoveryTVSelectors,
} from '../../shared/store/discovery-tv';

import { TV } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryTV } from '../../shared/interfaces/store/discovery-tv-state.interface';
import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../shared/store/tv-bookmark';
import { TVBookmarkMap } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import { TVDiscoveryFiltersComponent } from '../tv-discovery-filters/tv-discovery-filters.component';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';

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
  styleUrl: './tv-discovery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDiscoveryComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  private readonly bridgeDataService = inject(BridgeDataService);

  title = 'TV Discovery';

  mediaType: MediaType = 'tv';

  selectIsLoading$!: Observable<boolean>;
  selectNoAdditional$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;
  selectTVBookmarkMap$!: Observable<TVBookmarkMap>;
  selectCombinedDiscoveryFilters$!: Observable<[PayloadDiscoveryTV, Genre[]]>;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    // this.discoveryTVLanding();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  override initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryTVSelectors.selectIsLoading
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

  override initSubscriptions(): void {}

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
    console.log(payload);
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
