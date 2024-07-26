import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PersonDetailStore } from '../../shared/store/component-store/person-detail-store.service';
import {
  Movie,
  PersonDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CommonModule } from '@angular/common';
import { TMDB_ORIGINAL_IMG_URL, TMDB_RESIZED_IMG_URL } from '../../providers';
import { Store } from '@ngrx/store';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { MovieLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieLifecycleSelectors,
  MovieLifecycleActions,
} from '../../shared/store/movie-lifecycle';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, MediaListContainerComponent, ScrollNearEndDirective],
  providers: [PersonDetailStore, BridgeDataService],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css',
})
export class PersonDetailComponent implements OnInit {
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly personDetailStore = inject(PersonDetailStore);
  readonly resizedImgUrl = inject(TMDB_RESIZED_IMG_URL);
  readonly originalImgUrl = inject(TMDB_ORIGINAL_IMG_URL);
  private readonly bridgeDataService = inject(BridgeDataService);
  destroyed$ = new Subject();

  selectPersonDetail$!: Observable<PersonDetail | null>;
  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;
  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;
  selectMovieResultCurrentPage$!: Observable<number>;
  selectMovieResultTotalPages$!: Observable<number>;

  @Input({ required: true })
  personId: number = 0;

  movieResultCurrPage: number = 1;
  movieResultTotalPages: number = 1;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.searchPersonDetail();
    this.discoveryMovie();
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

  initSelectors() {
    this.selectPersonDetail$ = this.personDetailStore.selectPersonDetail$;
    this.selectIsLoading$ = this.personDetailStore.selectIsLoading$;
    this.selectMovieList$ =
      this.personDetailStore.selectDiscoveryMoviePersonDetail$;

    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
    );
    this.selectMovieResultCurrentPage$ =
      this.personDetailStore.selectMovieCurrentPage$;

    this.selectMovieResultTotalPages$ =
      this.personDetailStore.selectMovieTotalPages$;

    this.initSubscription();
  }

  initSubscription() {
    this.selectMovieResultCurrentPage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((currPage: number) => {
        this.movieResultCurrPage = currPage;
      });

    this.selectMovieResultTotalPages$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((totalPages: number) => {
        this.movieResultTotalPages = totalPages;
      });
  }

  searchPersonDetail() {
    this.personDetailStore.searchPersonDetail(this.personId);
  }

  discoveryMovie() {
    this.personDetailStore.discoveryMovie(this.personId);
  }

  discoveryAdditionalMovie(movieListLength: number = 0) {
    if (movieListLength) {
      this.personDetailStore.discoveryAdditionalMovie({
        personId: this.personId,
        currPage: this.movieResultCurrPage,
        totalPages: this.movieResultTotalPages,
      });
    }
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
}
