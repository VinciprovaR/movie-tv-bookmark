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
import { Movie } from '../../shared/interfaces/media.interface';
import { MediaType } from '../../shared/interfaces/media.interface';
import { DiscoveryMovieFiltersComponent } from '../discovery-movie-filters/discovery-movie-filters.component';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PayloadDiscoveryMovie } from '../../shared/interfaces/store/discovery-movie-state.interface';
import {
  Certification,
  Genre,
  Language,
} from '../../shared/interfaces/tmdb-filters.interface';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { MediaLifecycleMap } from '../../shared/interfaces/lifecycle.interface';

@Component({
  selector: 'app-movie-discovery',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
    DiscoveryMovieFiltersComponent,
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
  selectMovieLifecycleMap$!: Observable<MediaLifecycleMap>;
  selectCombinedDiscoveryFilters$!: Observable<
    [PayloadDiscoveryMovie, Genre[]]
  >;
  selectCertificationList$!: Observable<Certification[]>;
  selectLanguageList$!: Observable<Language[]>;

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.initFilterSelections();
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
      this.store.select(DiscoveryMovieSelectors.selectGenreList),
    ]);

    this.selectCertificationList$ = this.store.select(
      DiscoveryMovieSelectors.selectCertificationList
    );

    this.selectLanguageList$ = this.store.select(
      DiscoveryMovieSelectors.selectLanguageList
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
    this.bridgeDataService.inputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(mediaLifecycleDTO);
      });
  }

  initFilterSelections() {
    this.store.dispatch(DiscoveryMovieActions.getGenreList());
    this.store.dispatch(DiscoveryMovieActions.getCertificationList());
    this.store.dispatch(DiscoveryMovieActions.getLanguagesList());
  }

  createUpdateDeleteMovieLifecycle(mediaLifecycleDTO: MediaLifecycleDTO) {
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
