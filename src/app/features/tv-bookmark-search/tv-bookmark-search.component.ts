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
  bookmarkEnum,
  TVBookmarkMap,
} from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../shared/store/tv-bookmark';

import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { TV_Data } from '../../shared/interfaces/supabase/entities';

import {
  OptionFilter,
  Genre,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';

import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { PayloadTVBookmark } from '../../shared/interfaces/store/tv-bookmark-state.interface';
import { TVBookmarkFiltersComponent } from '../tv-bookmark-filters/tv-bookmark-filters.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tv-bookmark-search',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    TVBookmarkFiltersComponent,
    TitleCasePipe,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-bookmark-search.component.html',
  styleUrl: './tv-bookmark-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVBookmarkSearchComponent
  extends AbstractComponent
  implements OnInit
{
  title: string = 'TV Bookmarks';

  private readonly bridgeDataService = inject(BridgeDataService);

  @Input()
  bookmarkType!: bookmarkEnum;
  mediaType: MediaType = 'tv';

  selectIsLoading$!: Observable<boolean>;
  selectTVBookmarkMap$!: Observable<TVBookmarkMap>;
  selectTVList$!: Observable<TV_Data[]>;

  selectSortBy$!: Observable<OptionFilter[]>;
  selectCombinedBookmarkFilters$!: Observable<[PayloadTVBookmark, Genre[]]>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.title = params.bookmarkType;
        this.searchTV(params.bookmarkType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  override initSelectors() {
    this.selectIsLoading$ = this.store.select(
      TVBookmarkSelectors.selectIsLoading
    );

    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByBookmarkTV
    );

    this.selectCombinedBookmarkFilters$ = combineLatest([
      this.store.select(TVBookmarkSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListTV),
    ]);

    this.selectTVList$ = this.store.select(TVBookmarkSelectors.selectTVList);

    this.selectTVBookmarkMap$ = this.store.select(
      TVBookmarkSelectors.selectTVBookmarkMap
    );

    this.store
      .select(TVBookmarkSelectors.selectUpdateSearch)
      .pipe(
        takeUntil(this.destroyed$),
        filter((isUpdateSearch) => isUpdateSearch)
      )
      .subscribe(() => {
        this.searchTVByBookmarkLanding();
      });
  }

  override initSubscriptions(): void {}

  initBridgeData() {
    //data to bookmark-selector, bookmark selected
    this.selectTVBookmarkMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(movieBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.tvInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        let tvBookmarkDTO = mediaBookmarkDTO as MediaBookmarkDTO<TV_Data>;
        this.createUpdateDeleteTVBookmark(tvBookmarkDTO);
      });
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV_Data>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  searchTV(bookmarkType: bookmarkEnum) {
    this.bookmarkType = bookmarkType;
    this.searchTVByBookmarkLanding();
  }

  searchTVByBookmarkLanding() {
    let bookmarkEnum = this.bookmarkType;
    this.store.dispatch(
      TVBookmarkActions.searchTVByBookmarkLanding({
        bookmarkEnum,
      })
    );
  }

  searchTVByBookmarkSubmit(payload: PayloadTVBookmark) {
    let bookmarkEnum = this.bookmarkType;
    this.store.dispatch(
      TVBookmarkActions.searchTVByBookmarkSubmit({
        bookmarkEnum,
        payload,
      })
    );
  }
}
