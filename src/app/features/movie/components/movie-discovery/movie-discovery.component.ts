import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import {
  DiscoveryMovieActions,
  DiscoveryMovieSelectors,
} from '../../../../core/store/discovery-movie';
import { FiltersMetadataSelectors } from '../../../../core/store/filters-metadata';
import {
  MovieBookmarkActions,
  MovieBookmarkSelectors,
} from '../../../../core/store/movie-bookmark';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { InputQueryComponent } from '../../../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../../../shared/components/media-list-container/media-list-container.component';
import { PayloadDiscoveryMovie } from '../../../../shared/interfaces/store/discovery-movie-state.interface';
import { MediaBookmarkDTO } from '../../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { MovieBookmarkMap } from '../../../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  MediaType,
  Movie,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieDiscoveryFiltersComponent } from '../movie-discovery-filters/movie-discovery-filters.component';

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
  selectIsFirstLanding$!: Observable<boolean>;
  selectScrollTo$!: Observable<null>;
  title = 'Movie Discovery';
  mediaType: MediaType = 'movie';
  isFirstLanding: boolean = true;
  elXl: HTMLElement = window.document.body;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    if (this.isFirstLanding) {
      this.discoveryMovieLanding();
    }
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
    this.initDataBridge();
  }

  initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryMovieSelectors.selectIsLoading
    );

    this.selectIsFirstLanding$ = this.store.select(
      DiscoveryMovieSelectors.selectIsFirstLanding
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

    this.selectScrollTo$ = DiscoveryMovieSelectors.scrollToObs$;
  }

  initSubscriptions() {
    this.selectIsFirstLanding$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isFirstLanding: boolean) => {
        this.isFirstLanding = isFirstLanding;
      });
  }

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
