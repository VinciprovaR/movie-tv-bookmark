import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { TVLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVLifecycleSelectors,
  TVLifecycleActions,
} from '../../shared/store/tv-lifecycle';

import { CommonModule } from '@angular/common';
import { PersonDetailTVCreditsStore } from '../../shared/store/component-store/person-detail-tv-credits-store.service';

@Component({
  selector: 'app-person-detail-tv-credits',
  standalone: true,
  imports: [MediaListContainerComponent, CommonModule],
  providers: [BridgeDataService, PersonDetailTVCreditsStore],
  templateUrl: './person-detail-tv-credits.component.html',
  styleUrl: './person-detail-tv-credits.component.css',
})
export class PersonDetailTVCreditsComponent implements OnInit {
  title: string = 'TV partecipated in';

  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly personDetailTVCreditsStore = inject(
    PersonDetailTVCreditsStore
  );
  destroyed$ = new Subject();

  selectIsLoading$!: Observable<boolean>;
  selectTVList$!: Observable<TV[]>;
  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;

  @Input({ required: true })
  personId: number = 0;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.creditsTV();
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
        this.createUpdateDeleteTVLifecycle(
          mediaLifecycleDTO as MediaLifecycleDTO<TV>
        );
      });
  }

  initSelectors() {
    this.selectIsLoading$ = this.personDetailTVCreditsStore.selectIsLoading$;
    this.selectTVList$ =
      this.personDetailTVCreditsStore.selectCreditsTVPersonDetail$;

    this.selectTVLifecycleMap$ = this.store.select(
      TVLifecycleSelectors.selectTVLifecycleMap
    );
  }

  creditsTV() {
    this.personDetailTVCreditsStore.creditsTV(this.personId);
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO<TV>) {
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }
}
