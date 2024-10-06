import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { AskAiActions, AskAiSelectors } from '../../../../core/store/ask-ai';
import {
  MovieBookmarkActions,
  MovieBookmarkSelectors,
} from '../../../../core/store/movie-bookmark';
import {
  TVBookmarkActions,
  TVBookmarkSelectors,
} from '../../../../core/store/tv-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { InputQueryComponent } from '../../../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import {
  Movie,
  TV,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-ai-search',
  standalone: true,
  imports: [CommonModule, InputQueryComponent, MediaListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './ai-search.component.html',
  styleUrl: './ai-search.component.css',
})
export class AiSearchComponent extends AbstractComponent implements OnInit {
  private readonly bridgeDataService = inject(BridgeDataService);

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectMediaList$!: Observable<Movie[] & TV[]>;

  title = 'Ask Ai';
  // mediaType: MediaType = 'movie';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  initDataBridge() {
    // data to bookmark-selector, bookmark selected
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
        let tvBookmarkDTO = mediaBookmarkDTO as MediaBookmarkDTO<TV>;
        this.createUpdateDeleteTVBookmark(tvBookmarkDTO);
      });
  }

  initSelectors() {
    this.selectQuery$ = this.store.select(AskAiSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(AskAiSelectors.selectIsLoading);
    this.selectMediaList$ = this.store.select(AskAiSelectors.selectMediaResult);
  }

  createUpdateDeleteMovieBookmark(mediaBookmarkDTO: MediaBookmarkDTO<Movie>) {
    this.store.dispatch(
      MovieBookmarkActions.createUpdateDeleteMovieBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  createUpdateDeleteTVBookmark(mediaBookmarkDTO: MediaBookmarkDTO<TV>) {
    this.store.dispatch(
      TVBookmarkActions.createUpdateDeleteTVBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  askOpenAi(query: string) {
    console.log('Ask ai, user query: ', query);
    this.store.dispatch(AskAiActions.askAi({ query }));
  }
}
