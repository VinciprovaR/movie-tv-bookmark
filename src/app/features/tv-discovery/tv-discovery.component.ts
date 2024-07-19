import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';

import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import {
  DiscoveryTVActions,
  DiscoveryTVSelectors,
} from '../../shared/store/discovery-tv';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { TV } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryTV } from '../../shared/interfaces/store/discovery-tv-state.interface';
import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';
import { TVLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { TVDiscoveryFiltersComponent } from '../tv-discovery-filters/tv-discovery-filters.component';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

@Component({
  selector: 'app-tv-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,

    MediaListContainerComponent,
    ScrollNearEndDirective,
    TVDiscoveryFiltersComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-discovery.component.html',
  styleUrl: './tv-discovery.component.css',
})
export class TVDiscoveryComponent implements OnInit, AfterViewInit {
  mediaType: MediaType = 'tv';

  destroyed$ = new Subject();

  selectIsLoading$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;
  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;
  selectCombinedDiscoveryFilters$!: Observable<[PayloadDiscoveryTV, Genre[]]>;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryTVSelectors.selectIsLoading
    );

    this.selectTVLifecycleMap$ = this.store.select(
      TVLifecycleSelectors.selectTVLifecycleMap
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
  }

  initDataBridge() {
    //data to lifecycle-selector, lifecycle selected
    this.selectTVLifecycleMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(tvLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.tvInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteTVLifecycle(mediaLifecycleDTO);
      });
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO<TV>) {
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  discoveryTV(payload: PayloadDiscoveryTV) {
    console.log(payload);
    this.store.dispatch(
      DiscoveryTVActions.discoveryTV({
        payload: payload,
      })
    );
  }

  discoveryAdditionalTV(tvListLength: number = 0) {
    if (tvListLength) {
      this.store.dispatch(DiscoveryTVActions.discoveryAdditionalTV());
    }
  }
}
