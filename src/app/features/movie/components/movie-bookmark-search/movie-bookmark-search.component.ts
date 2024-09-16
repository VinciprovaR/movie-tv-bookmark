import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { combineLatest, filter, Observable, takeUntil } from 'rxjs';
import { MovieBookmarkFiltersComponent } from '../movie-bookmark-filters/movie-bookmark-filters.component';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import { FiltersMetadataSelectors } from '../../../../core/store/filters-metadata';
import { MovieBookmarkSelectors, MovieBookmarkActions } from '../../../../core/store/movie-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { PayloadMovieBookmark } from '../../../../shared/interfaces/store/movie-bookmark-state.interface';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { MovieData } from '../../../../shared/interfaces/supabase/movie-data.entity.interface';
import { MovieBookmarkMap, bookmarkEnum } from '../../../../shared/interfaces/supabase/supabase-bookmark.interface';
import { OptionFilter, Genre } from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';
import { MediaType, Movie } from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-movie-bookmark-search',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    MovieBookmarkFiltersComponent,
    TitleCasePipe,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-bookmark-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieBookmarkSearchComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly bridgeDataService = inject(BridgeDataService);
  selectMovieBookmarkMap$!: Observable<MovieBookmarkMap>;
  selectMovieList$!: Observable<MovieData[]>;
  selectIsLoading$!: Observable<boolean>;
  selectSortBy$!: Observable<OptionFilter[]>;
  selectCombinedBookmarkFilters$!: Observable<[PayloadMovieBookmark, Genre[]]>;
  @Input()
  bookmarkType!: bookmarkEnum;
  mediaType: MediaType = 'movie';
  title: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.title = params.bookmarkType;
        this.searchMovie(params.bookmarkType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  initSelectors() {
    this.selectIsLoading$ = this.store.select(
      MovieBookmarkSelectors.selectIsLoading
    );

    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByBookmarkMovie
    );

    this.selectCombinedBookmarkFilters$ = combineLatest([
      this.store.select(MovieBookmarkSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListMovie),
    ]);

    this.selectMovieList$ = this.store.select(
      MovieBookmarkSelectors.selectMovieList
    );

    this.selectMovieBookmarkMap$ = this.store.select(
      MovieBookmarkSelectors.selectMovieBookmarkMap
    );

    this.store
      .select(MovieBookmarkSelectors.selectUpdateSearch)
      .pipe(
        takeUntil(this.destroyed$),
        filter((isUpdateSearch) => isUpdateSearch)
      )
      .subscribe(() => {
        this.searchMovieByBookmarkLanding();
      });
  }

  initBridgeData() {
    //data to bookmark-selector, bookmark selected
    this.selectMovieBookmarkMap$
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

  searchMovie(bookmarkType: bookmarkEnum) {
    this.bookmarkType = bookmarkType;
    this.searchMovieByBookmarkLanding();
  }

  searchMovieByBookmarkLanding() {
    let bookmarkEnum = this.bookmarkType;
    this.store.dispatch(
      MovieBookmarkActions.searchMovieByBookmarkLanding({
        bookmarkEnum,
      })
    );
  }

  searchMovieByBookmarkSubmit(payload: PayloadMovieBookmark) {
    let bookmarkEnum = this.bookmarkType;
    this.store.dispatch(
      MovieBookmarkActions.searchMovieByBookmarkSubmit({
        bookmarkEnum,
        payload,
      })
    );
  }
}
