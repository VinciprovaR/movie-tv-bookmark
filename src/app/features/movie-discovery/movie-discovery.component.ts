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
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

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
})
export class MovieDiscoveryComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  private readonly bridgeDataService = inject(BridgeDataService);
  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;
  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;
  selectCombinedDiscoveryFilters$!: Observable<
    [PayloadDiscoveryMovie, Genre[]]
  >;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;
  selectSortBy$!: Observable<OptionFilter[]>;

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
  override initSubscriptions(): void {}

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
        this.createUpdateDeleteMovieLifecycle(
          mediaLifecycleDTO as MediaLifecycleDTO<Movie>
        );
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
