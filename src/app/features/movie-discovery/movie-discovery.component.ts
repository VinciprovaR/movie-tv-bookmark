import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import {
  DiscoveryMovieActions,
  DiscoveryMovieSelectors,
} from '../../shared/store/discovery-movie';

import { Movie } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieDiscoveryFiltersComponent } from '../movie-discovery-filters/movie-discovery-filters.component';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryMovie } from '../../shared/interfaces/store/discovery-movie-state.interface';
import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  MovieBookmarkActions,
  MovieBookmarkSelectors,
} from '../../shared/store/movie-bookmark';
import { MovieBookmarkMap } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-movie-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    MovieDiscoveryFiltersComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-discovery.component.html',
  styleUrl: './movie-discovery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDiscoveryComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  private readonly bridgeDataService = inject(BridgeDataService);
  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;
  selectMovieBookmarkMap$!: Observable<MovieBookmarkMap>;
  selectCombinedDiscoveryFilters$!: Observable<
    [PayloadDiscoveryMovie, Genre[]]
  >;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;
  selectNoAdditional$!: Observable<boolean>;

  title = 'Movie Discovery';
  mediaType: MediaType = 'movie';

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    //    this.discoveryMovieLanding();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  override initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryMovieSelectors.selectIsLoading
    );

    this.selectMovieBookmarkMap$ = this.store.select(
      MovieBookmarkSelectors.selectMovieBookmarkMap
    );

    this.selectMovieList$ = this.store.select(
      DiscoveryMovieSelectors.selectMovieList
    );

    this.selectCombinedDiscoveryFilters$ = combineLatest([
      this.store.select(DiscoveryMovieSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListMovie),
    ]);

    this.selectCertificationList$ = this.store.select(
      FiltersMetadataSelectors.selectCertificationListMovie
    );

    this.selectLanguageList$ = this.store.select(
      FiltersMetadataSelectors.selectLanguageListMedia
    );

    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByDiscoveryMovie
    );

    this.selectNoAdditional$ = this.store.select(
      DiscoveryMovieSelectors.selectNoAdditional
    );
  }
  override initSubscriptions(): void {}

  initDataBridge() {
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

  discoveryMovieLanding() {
    this.store.dispatch(DiscoveryMovieActions.discoveryMovieLanding());
  }

  discoveryMovie(payload: PayloadDiscoveryMovie) {
    this.store.dispatch(
      DiscoveryMovieActions.discoveryMovie({
        payload: payload,
      })
    );
  }

  discoveryAdditionalMovie() {
    this.store.dispatch(DiscoveryMovieActions.discoveryAdditionalMovie());
  }
}
