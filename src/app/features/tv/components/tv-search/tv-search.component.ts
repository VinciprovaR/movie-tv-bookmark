import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { SearchTVActions, SearchTVSelectors } from '../../../../core/store/search-tv';
import { TVBookmarkActions, TVBookmarkSelectors } from '../../../../core/store/tv-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { InputQueryComponent } from '../../../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { MediaType, TV } from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-tv-search',
  standalone: true,
  imports: [CommonModule, InputQueryComponent, MediaListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './tv-search.component.html',
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

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }
  initSelectors() {
    this.selectQuery$ = this.store.select(SearchTVSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(
      SearchTVSelectors.selectIsLoading
    );
    this.selectTVList$ = this.store.select(SearchTVSelectors.selectTVList);
    this.selectNoAdditional$ = this.store.select(
      SearchTVSelectors.selectNoAdditional
    );
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
