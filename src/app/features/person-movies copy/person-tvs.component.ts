import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { TVLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  TV,
  PersonDetailTVCredits,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVLifecycleSelectors,
  TVLifecycleActions,
} from '../../shared/store/tv-lifecycle';

import { CommonModule } from '@angular/common';
import { PersonDetailTVCreditsStore } from '../../shared/store/component-store/person-detail-tv-credits-store.service';
import { MissingFieldPlaceholderComponent } from '../../shared/components/missing-field-placeholder/missing-field-placeholder.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-person-tvs',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    MissingFieldPlaceholderComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './person-tvs.component.html',
  styleUrl: './person-tvs.component.css',
})
export class PersonTVsComponent
  extends AbstractComponent
  implements OnInit, OnDestroy
{
  title: string = 'TV partecipated in';

  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly personDetailCreditsTVStore = inject(
    PersonDetailTVCreditsStore
  );

  selectIsLoading$!: Observable<boolean>;
  personDetailTVCredits$!: Observable<PersonDetailTVCredits>;
  selectTVLifecycleMap$!: Observable<TVLifecycleMap>;

  @Input({ required: true })
  personId: number = 0;

  constructor() {
    super();
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

  override initSelectors() {
    this.selectIsLoading$ = this.personDetailCreditsTVStore.selectIsLoading$;
    this.personDetailTVCredits$ =
      this.personDetailCreditsTVStore.selectCreditsTVPersonDetail$;

    this.selectTVLifecycleMap$ = this.store.select(
      TVLifecycleSelectors.selectTVLifecycleMap
    );
  }

  override initSubscriptions(): void {}

  creditsTV() {
    this.personDetailCreditsTVStore.personDetailTVCredits(this.personId);
  }

  createUpdateDeleteTVLifecycle(mediaLifecycleDTO: MediaLifecycleDTO<TV>) {
    this.store.dispatch(
      TVLifecycleActions.createUpdateDeleteTVLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  removeDuplicateCrewTV(crewTVList: TV[]): TV[] {
    let crewTVIdList: number[] = [];
    return crewTVList.filter((crewTV) => {
      const isPresent = crewTVIdList.indexOf(crewTV.id) > -1;
      crewTVIdList.push(crewTV.id);
      return !isPresent;
    });
  }

  ngOnDestroy(): void {
    this.personDetailCreditsTVStore.cleanPersonDetailCreditsTV();
  }
}
