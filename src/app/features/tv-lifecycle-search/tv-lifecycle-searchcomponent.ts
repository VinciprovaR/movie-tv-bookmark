import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  MediaType,
  TV,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';

import { Store } from '@ngrx/store';
import {
  lifecycleEnum,
  TVLifecycleMap,
} from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';

import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { TV_Data } from '../../shared/interfaces/supabase/entities';
import { PayloadMediaLifecycle } from '../../shared/interfaces/store/media-lifecycle-state.interface';
import {
  OptionFilter,
  Genre,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import { MediaLifecycleFiltersComponent } from '../../shared/components/media-lifecycle-filters/media-lifecycle-filters.component';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

@Component({
  selector: 'app-tv-lifecycle-search',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    MediaLifecycleFiltersComponent,
  ],

  templateUrl: './tv-lifecycle-search.component.html',
  styleUrl: './tv-lifecycle-search.component.css',
})
export class TVLifecycleSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  @Input()
  lifecycleType!: lifecycleEnum;
  mediaType: MediaType = 'tv';

  destroyed$ = new Subject();

  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;
  selectTVList$!: Observable<TV_Data[]>;

  selectSortBy$!: Observable<OptionFilter[]>;
  selectCombinedLifecycleFilters$!: Observable<
    [PayloadMediaLifecycle, Genre[]]
  >;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.searchTV(params.lifecycleType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  initSelectors() {
    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByLifecycleTV
    );

    this.selectCombinedLifecycleFilters$ = combineLatest([
      this.store.select(TVLifecycleSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListTV),
    ]);

    this.selectTVList$ = this.store.select(TVLifecycleSelectors.selectTVList);

    this.selectTVLifecycleMap$ = this.store.select(
      TVLifecycleSelectors.selectTVLifecycleMap
    );

    this.store
      .select(TVLifecycleSelectors.selectUpdateSearch)
      .pipe(
        takeUntil(this.destroyed$),
        filter((isUpdateSearch) => isUpdateSearch)
      )
      .subscribe(() => {
        this.searchTVByLifecycleLanding();
      });
  }

  initBridgeData() {
    //data to lifecycle-selector, lifecycle selected
    this.selectTVLifecycleMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
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

  searchTV(lifecycleType: lifecycleEnum) {
    this.lifecycleType = lifecycleType;
    this.searchTVByLifecycleLanding();
  }

  searchTVByLifecycleLanding() {
    let lifecycleEnum = this.lifecycleType;
    this.store.dispatch(
      TVLifecycleActions.searchTVByLifecycleLanding({
        lifecycleEnum,
      })
    );
  }

  searchTVByLifecycleSubmit(payload: PayloadMediaLifecycle) {
    let lifecycleEnum = this.lifecycleType;
    this.store.dispatch(
      TVLifecycleActions.searchTVByLifecycleSubmit({
        lifecycleEnum,
        payload,
      })
    );
  }
}
