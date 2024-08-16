import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';

import { CommonModule, TitleCasePipe } from '@angular/common';
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

import {
  OptionFilter,
  Genre,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';

import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { PayloadTVLifecycle } from '../../shared/interfaces/store/tv-lifecycle-state.interface';
import { TVLifecycleFiltersComponent } from '../tv-lifecycle-filters/tv-lifecycle-filters.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-tv-lifecycle-search',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    TVLifecycleFiltersComponent,
    TitleCasePipe,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-lifecycle-search.component.html',
  styleUrl: './tv-lifecycle-search.component.css',
})
export class TVLifecycleSearchComponent
  extends AbstractComponent
  implements OnInit
{
  title: string = 'TV Bookmarks';

  private readonly bridgeDataService = inject(BridgeDataService);

  @Input()
  lifecycleType!: lifecycleEnum;
  mediaType: MediaType = 'tv';

  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;
  selectTVList$!: Observable<TV_Data[]>;

  selectSortBy$!: Observable<OptionFilter[]>;
  selectCombinedLifecycleFilters$!: Observable<[PayloadTVLifecycle, Genre[]]>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.title = params.lifecycleType;
        this.searchTV(params.lifecycleType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  override initSelectors() {
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

  override initSubscriptions(): void {}

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
        let tvLifecycleDTO = mediaLifecycleDTO as MediaLifecycleDTO<TV_Data>;
        this.createUpdateDeleteTVLifecycle(tvLifecycleDTO);
      });
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO<TV_Data>) {
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

  searchTVByLifecycleSubmit(payload: PayloadTVLifecycle) {
    let lifecycleEnum = this.lifecycleType;
    this.store.dispatch(
      TVLifecycleActions.searchTVByLifecycleSubmit({
        lifecycleEnum,
        payload,
      })
    );
  }
}
