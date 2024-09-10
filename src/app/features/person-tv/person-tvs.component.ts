import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { TVBookmarkMap } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  TV,
  PersonDetailTVCredits,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  TVBookmarkSelectors,
  TVBookmarkActions,
} from '../../shared/store/tv-bookmark';
import { CommonModule } from '@angular/common';
import { PersonDetailTVCreditsStore } from '../../shared/component-store/person-detail-tv-credits-store.service';
import { MissingFieldPlaceholderComponent } from '../../shared/components/missing-field-placeholder/missing-field-placeholder.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ChangeDetectionStrategy } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  selectTVBookmarkMap$!: Observable<TVBookmarkMap>;

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
    //data to bookmark-selector, bookmark selected
    this.selectTVBookmarkMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tvBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(tvBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.tvInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteTVBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<TV>
        );
      });
  }

  override initSelectors() {
    this.selectIsLoading$ = this.personDetailCreditsTVStore.selectIsLoading$;
    this.personDetailTVCredits$ =
      this.personDetailCreditsTVStore.selectCreditsTVPersonDetail$;

    this.selectTVBookmarkMap$ = this.store.select(
      TVBookmarkSelectors.selectTVBookmarkMap
    );
  }

  override initSubscriptions(): void {}

  creditsTV() {
    this.personDetailCreditsTVStore.personDetailTVCredits(this.personId);
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
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
