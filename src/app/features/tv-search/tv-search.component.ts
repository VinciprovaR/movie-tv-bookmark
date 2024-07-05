import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  SearchTVActions,
  SearchTVSelectors,
} from '../../shared/store/search-tv';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';

import { MediaType, TV, TVResult } from '../../shared/models/media.models';
import { MediaLifecycleDTO } from '../../shared/models/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { SupabaseLifecycleService } from '../../shared/services/supabase';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';

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
  tvListLength: number = 0;
  mediaType: MediaType = 'tv';

  destroyed$ = new Subject();

  query$ = this.store.select(SearchTVSelectors.selectQuery);
  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchTVSelectors.selectIsLoading
  );
  selectTVResult$: Observable<TVResult> = this.store.select(
    SearchTVSelectors.selectTVResult
  );
  tv$: Observable<TV[]> = this.selectTVResult$.pipe(
    map((TVResult) => {
      this.tvListLength = TVResult.results.length;
      return TVResult.results;
    })
  );

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //data to lifecycle-selector, options
    this.supabaseLifecycleService.lifeCycleOptions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lifecycleOptions) => {
        this.bridgeDataService.pushSelectLifecycleOptions(lifecycleOptions);
      });

    //data to lifecycle-selector, lifecycle selected
    this.store
      .select(TVLifecycleSelectors.selectTVLifecycleMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(tvLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.inputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteTVLifecycle(mediaLifecycleDTO);
      });
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  searchTV(query: string) {
    this.store.dispatch(SearchTVActions.searchTV({ query }));
  }

  searchAdditionalTV() {
    if (this.tvListLength > 0) {
      this.store.dispatch(SearchTVActions.searchAdditionalTV());
    }
  }
}
