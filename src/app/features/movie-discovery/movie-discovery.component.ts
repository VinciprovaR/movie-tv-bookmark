import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import {
  DiscoveryMovieActions,
  DiscoveryMovieSelectors,
} from '../../shared/store/discovery-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { Movie } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieDiscoveryFiltersComponent } from '../movie-discovery-filters/movie-discovery-filters.component';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryMovie } from '../../shared/interfaces/store/discovery-movie-state.interface';
import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { MovieLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';

@Component({
  selector: 'app-movie-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
    MovieDiscoveryFiltersComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-discovery.component.html',
  styleUrl: './movie-discovery.component.css',
})
export class MovieDiscoveryComponent implements OnInit, AfterViewInit {
  mediaType: MediaType = 'movie';

  destroyed$ = new Subject();

  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;
  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;
  selectCombinedDiscoveryFilters$!: Observable<
    [PayloadDiscoveryMovie, Genre[]]
  >;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
  }

  initSelectors() {
    this.selectIsLoading$ = this.store.select(
      DiscoveryMovieSelectors.selectIsLoading
    );

    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
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
  }

  initDataBridge() {
    //data to lifecycle-selector, lifecycle selected
    this.selectMovieLifecycleMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.movieInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });
  }

  createUpdateDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>
  ) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
      })
    );
  }

  discoveryMovie(payload: any) {
    this.store.dispatch(
      DiscoveryMovieActions.discoveryMovie({
        payload: payload,
      })
    );
  }

  discoveryAdditionalMovie(movieListLength: number = 0) {
    if (movieListLength) {
      this.store.dispatch(DiscoveryMovieActions.discoveryAdditionalMovie());
    }
  }
}
