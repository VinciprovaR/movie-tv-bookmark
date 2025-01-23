import { Component, inject, Input, OnInit } from '@angular/core';
import { MediaListContainerComponent } from '../media-list-container/media-list-container.component';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { takeUntil } from 'rxjs';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../../core/store/tv-bookmark';
import { MediaBookmarkDTO } from '../../interfaces/supabase/media-bookmark.DTO.interface';

@Component({
  selector: 'app-popular-tv',
  imports: [MediaListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './popular-tv.component.html',
})
export class PopularTVComponent extends AbstractComponent implements OnInit {
  private readonly bridgeDataService = inject(BridgeDataService);

  @Input({ required: true })
  isLoading!: boolean;
  @Input({ required: true })
  trendingMediaTVList!: TV[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initDataBridge();
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
        this.createUpdateDeleteTVBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<TV>
        );
      });
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }
}
