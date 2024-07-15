import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { CommonModule } from '@angular/common';
import {
  MediaType,
  Movie,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  MovieLifecycleActions,
  MovieLifecycleSelectors,
} from '../../shared/store/movie-lifecycle';
import { Store } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { LifecycleEnum } from '../../shared/enums/lifecycle.enum';
import { Movie_Data } from '../../shared/interfaces/supabase/entities';

@Component({
  selector: 'app-movie-lifecycle-search-list-container',
  standalone: true,
  imports: [MediaListContainerComponent, CommonModule],

  templateUrl: './movie-lifecycle-search-list-container.component.html',
  styleUrl: './movie-lifecycle-search-list-container.component.css',
})
export class MovieLifecycleListsContainerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  @Input()
  lifecycleType!: string;
  mediaType: MediaType = 'movie';

  destroyed$ = new Subject();

  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;
  selectMovieList$!: Observable<Movie_Data[]>;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.searchMovie(params.lifecycleType);
      });

    this.initSelectors();
    this.initBridgeData();
  }

  initSelectors() {
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
        this.searchMovieByLifecycle();
      });
  }

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

  searchMovie(lifecycleType: string) {
    this.lifecycleType = lifecycleType;
    this.searchMovieByLifecycle();
  }

  searchMovieByLifecycle() {
    let lifecycleId = LifecycleEnum[this.lifecycleType];
    this.store.dispatch(
      MovieLifecycleActions.searchMovieByLifecycle({
        lifecycleId,
      })
    );
  }
}
