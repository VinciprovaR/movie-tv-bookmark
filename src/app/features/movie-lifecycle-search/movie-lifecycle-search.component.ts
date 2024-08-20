import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  MediaType,
  Movie,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import {
  lifecycleEnum,
  MovieLifecycleMap,
} from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { Store } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';

import { Movie_Data } from '../../shared/interfaces/supabase/entities';

import {
  Genre,
  OptionFilter,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import { FiltersMetadataSelectors } from '../../shared/store/filters-metadata';
import { PayloadMovieLifecycle } from '../../shared/interfaces/store/movie-lifecycle-state.interface';
import { MovieLifecycleFiltersComponent } from '../movie-lifecycle-filters/movie-lifecycle-filters.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-movie-lifecycle-search',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    MovieLifecycleFiltersComponent,
    TitleCasePipe,
  ],
  providers: [BridgeDataService],
  templateUrl: './movie-lifecycle-search.component.html',
  styleUrl: './movie-lifecycle-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieLifecycleSearchComponent
  extends AbstractComponent
  implements OnInit
{
  title: string = '';

  private readonly bridgeDataService = inject(BridgeDataService);

  @Input()
  lifecycleType!: lifecycleEnum;
  mediaType: MediaType = 'movie';

  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;
  selectMovieList$!: Observable<Movie_Data[]>;
  selectIsLoading$!: Observable<boolean>;
  selectSortBy$!: Observable<OptionFilter[]>;
  selectCombinedLifecycleFilters$!: Observable<
    [PayloadMovieLifecycle, Genre[]]
  >;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.title = params.lifecycleType;
        this.searchMovie(params.lifecycleType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  override initSelectors() {
    this.selectIsLoading$ = this.store.select(
      MovieLifecycleSelectors.selectIsLoading
    );

    this.selectSortBy$ = this.store.select(
      FiltersMetadataSelectors.selectSortByLifecycleMovie
    );

    this.selectCombinedLifecycleFilters$ = combineLatest([
      this.store.select(MovieLifecycleSelectors.selectPayload),
      this.store.select(FiltersMetadataSelectors.selectGenreListMovie),
    ]);

    this.selectMovieList$ = this.store.select(
      MovieLifecycleSelectors.selectMovieList
    );

    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
    );

    this.store
      .select(MovieLifecycleSelectors.selectUpdateSearch)
      .pipe(
        takeUntil(this.destroyed$),
        filter((isUpdateSearch) => isUpdateSearch)
      )
      .subscribe(() => {
        this.searchMovieByLifecycleLanding();
      });
  }

  override initSubscriptions(): void {}

  initBridgeData() {
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

  searchMovie(lifecycleType: lifecycleEnum) {
    this.lifecycleType = lifecycleType;
    this.searchMovieByLifecycleLanding();
  }

  searchMovieByLifecycleLanding() {
    let lifecycleEnum = this.lifecycleType;
    this.store.dispatch(
      MovieLifecycleActions.searchMovieByLifecycleLanding({
        lifecycleEnum,
      })
    );
  }

  searchMovieByLifecycleSubmit(payload: PayloadMovieLifecycle) {
    let lifecycleEnum = this.lifecycleType;
    this.store.dispatch(
      MovieLifecycleActions.searchMovieByLifecycleSubmit({
        lifecycleEnum,
        payload,
      })
    );
  }
}
