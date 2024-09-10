import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { Observable, takeUntil } from 'rxjs';
import {
  SearchTVActions,
  SearchTVSelectors,
} from '../../shared/store/search-tv';
import {
  MediaType,
  TV,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../shared/store/tv-bookmark';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tv-search',
  standalone: true,
  imports: [CommonModule, InputQueryComponent, MediaListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './tv-search.component.html',
  styleUrl: './tv-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVSearchComponent extends AbstractComponent implements OnInit {
  private readonly bridgeDataService = inject(BridgeDataService);

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;
  selectNoAdditional$!: Observable<boolean>;

  title = 'TV Search';
  mediaType: MediaType = 'tv';

  constructor() {
    super();
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }
  override initSelectors() {
    this.selectQuery$ = this.store.select(SearchTVSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(
      SearchTVSelectors.selectIsLoading
    );
    this.selectTVList$ = this.store.select(SearchTVSelectors.selectTVList);
    this.selectNoAdditional$ = this.store.select(
      SearchTVSelectors.selectNoAdditional
    );
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
        let tvBookmarkDTO = mediaBookmarkDTO as MediaBookmarkDTO<TV>;
        this.createUpdateDeleteTVBookmark(tvBookmarkDTO);
      });
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  searchTV(query: string) {
    this.store.dispatch(SearchTVActions.searchTV({ query }));
  }

  searchAdditionalTV() {
    this.store.dispatch(SearchTVActions.searchAdditionalTV());
  }
}
