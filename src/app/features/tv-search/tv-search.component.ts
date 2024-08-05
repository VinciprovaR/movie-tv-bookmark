import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';

import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  SearchTVActions,
  SearchTVSelectors,
} from '../../shared/store/search-tv';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';

import {
  MediaType,
  TV,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';

import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

@Component({
  selector: 'app-tv-search',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
  ],
  providers: [BridgeDataService],
  templateUrl: './tv-search.component.html',
  styleUrl: './tv-search.component.css',
})
export class TVSearchComponent implements OnInit {
  title = 'TV Search';

  mediaType: MediaType = 'tv';

  destroyed$ = new Subject();

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  ngAfterViewInit(): void {}

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
  }

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
        let tvLifecycleDTO = mediaLifecycleDTO as MediaLifecycleDTO<TV>;
        this.createUpdateDeleteTVLifecycle(tvLifecycleDTO);
      });
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO<TV>) {
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  searchTV(query: string) {
    this.store.dispatch(SearchTVActions.searchTV({ query }));
  }

  searchAdditionalTV(movieListLength: number = 0) {
    this.store.dispatch(SearchTVActions.searchAdditionalTV());
  }
}
