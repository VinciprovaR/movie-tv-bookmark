import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { TVBookmarkActions, TVBookmarkSelectors } from '../../../../core/store/tv-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { MissingFieldPlaceholderComponent } from '../../../../shared/components/missing-field-placeholder/missing-field-placeholder.component';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { TVBookmarkMap } from '../../../../shared/interfaces/supabase/supabase-bookmark.interface';
import { PersonDetailTVCredits, TV } from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonTVsComponent extends AbstractComponent implements OnInit {
  title: string = 'TV shows partecipated in as';

  private readonly bridgeDataService = inject(BridgeDataService);

  selectIsLoading$!: Observable<boolean>;
  @Input({ required: true })
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

  initSelectors() {
    this.selectTVBookmarkMap$ = this.store.select(
      TVBookmarkSelectors.selectTVBookmarkMap
    );
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
}
