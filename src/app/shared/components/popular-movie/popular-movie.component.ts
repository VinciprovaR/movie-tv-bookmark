import { Component, inject, Input, OnInit } from '@angular/core';
import { MediaListContainerComponent } from '../media-list-container/media-list-container.component';
import { Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { takeUntil } from 'rxjs';
import {
  MovieBookmarkActions,
  MovieBookmarkSelectors,
} from '../../../core/store/movie-bookmark';
import { MediaBookmarkDTO } from '../../interfaces/supabase/media-bookmark.DTO.interface';

@Component({
  selector: 'app-popular-movie',
  imports: [MediaListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './popular-movie.component.html',
})
export class PopularMovieComponent extends AbstractComponent implements OnInit {
  private readonly bridgeDataService = inject(BridgeDataService);

  @Input({ required: true })
  isLoading!: boolean;
  @Input({ required: true })
  trendingMediaMovieList!: Movie[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initDataBridge();
  }

  initDataBridge() {
    //data to bookmark-selector, bookmark selected
    this.store
      .select(MovieBookmarkSelectors.selectMovieBookmarkMap)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(movieBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.movieInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteMovieBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<Movie>
        );
      });
  }

  createUpdateDeleteMovieBookmark(mediaBookmarkDTO: MediaBookmarkDTO<Movie>) {
    this.store.dispatch(
      MovieBookmarkActions.createUpdateDeleteMovieBookmark({
        mediaBookmarkDTO,
      })
    );
  }
}
