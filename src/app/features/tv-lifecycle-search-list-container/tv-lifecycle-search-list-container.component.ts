import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

import { CommonModule } from '@angular/common';
import {
  MediaType,
  TV,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';

import { Store } from '@ngrx/store';
import { TVLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  TVLifecycleActions,
  TVLifecycleSelectors,
} from '../../shared/store/tv-lifecycle';
import { LifecycleEnum } from '../../shared/enums/lifecycle.enum';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { TV_Data } from '../../shared/interfaces/supabase/entities';

@Component({
  selector: 'app-tv-lifecycle-search-list-container',
  standalone: true,
  imports: [MediaListContainerComponent, CommonModule],

  templateUrl: './tv-lifecycle-search-list-container.component.html',
  styleUrl: './tv-lifecycle-search-list-container.component.css',
})
export class TVLifecycleListsContainerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  @Input()
  lifecycleType!: string;
  mediaType: MediaType = 'tv';

  destroyed$ = new Subject();

  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;
  selectTVList$!: Observable<TV_Data[]>;

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
        this.searchTVByLifecycle();
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

  searchTV(lifecycleType: string) {
    this.lifecycleType = lifecycleType;
    this.searchTVByLifecycle();
  }

  searchTVByLifecycle() {
    let lifecycleId = LifecycleEnum[this.lifecycleType];
    this.store.dispatch(
      TVLifecycleActions.searchTVByLifecycle({
        lifecycleId,
      })
    );
  }
}
