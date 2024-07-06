import { Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SearchTVActions,
  SearchTVSelectors,
} from '../../shared/store/search-tv';
import { Observable } from 'rxjs';
import { MediaType, TVDetail } from '../../shared/interfaces/media.interface';
import { CommonModule } from '@angular/common';
import { TMDB_RESIZED_IMG_URL } from '../../providers';

@Component({
  selector: 'app-tv-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-detail.component.html',
  styleUrl: './tv-detail.component.css',
})
export class TVDetailComponent {
  @Input()
  tvId: number = 0;
  resizedImgUrl: string = '';
  mediaType: MediaType = 'tv';
  tvDetail$: Observable<TVDetail | null> = this.store.select(
    SearchTVSelectors.selectTVDetail
  );

  constructor(
    private store: Store,
    @Inject(TMDB_RESIZED_IMG_URL) private TMDB_RESIZED_IMG_URL: string
  ) {
    this.resizedImgUrl = TMDB_RESIZED_IMG_URL;
  }

  ngOnInit(): void {
    this.store.dispatch(
      SearchTVActions.searchTVDetail({
        tvId: this.tvId,
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(SearchTVActions.cleanTVDetail());
  }
}
