import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MovieDetailCreditsStore } from '../core/component-store/movie-detail-credits.store.service';
import { MovieDetailStore } from '../core/component-store/movie-detail-store.service';
import { PersonDetailStore } from '../core/component-store/person-detail-store.service';
import { TVDetailCreditsStore } from '../core/component-store/tv-detail-credits.store.service';
import { TVDetailStore } from '../core/component-store/tv-detail-store.service';
import { AuthSelectors } from '../core/store/auth';
import { DiscoveryMovieSelectors } from '../core/store/discovery-movie';
import { DiscoveryTVSelectors } from '../core/store/discovery-tv';
import { MovieBookmarkSelectors } from '../core/store/movie-bookmark';
import { SearchMovieSelectors } from '../core/store/search-movie';
import { SearchPeopleSelectors } from '../core/store/search-people';
import { SearchTVSelectors } from '../core/store/search-tv';
import { TVBookmarkSelectors } from '../core/store/tv-bookmark';
import { Store } from '@ngrx/store';
import { TrendingMediaStore } from '../core/component-store/trending-media-store.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  protected readonly store = inject(Store);
  destroyed$ = new Subject();
  protected readonly destroyRef$ = inject(DestroyRef);
  protected readonly trendingMediaStore = inject(TrendingMediaStore);

  private readonly toggleIsLoading$: Subject<{
    isLoading: boolean;
    isLanding: boolean;
  }> = new Subject<{ isLoading: boolean; isLanding: boolean }>();
  toggleIsLoadingObs$: Observable<{ isLoading: boolean; isLanding: boolean }> =
    this.toggleIsLoading$.asObservable();
  //Auth
  authSelectIsLoading$!: Observable<boolean>;
  authSelectIsLoadingForPasswordValidation$!: Observable<boolean>;
  authSelectIsLoadingForCurrentUser$!: Observable<boolean>;
  //Movie
  private readonly movieDetailCreditsStore = inject(MovieDetailCreditsStore);
  private readonly movieDetailStore = inject(MovieDetailStore);
  movieSearchSelectIsLoading$!: Observable<boolean>;
  movieDiscoverySelectIsLoading$!: Observable<boolean>;
  movieBookmarksSelectIsLoading$!: Observable<boolean>;
  movieDetailSelectIsLoading$!: Observable<boolean>;
  movieDetailCreditsSelectIsLoading$!: Observable<boolean>;

  //TV
  private readonly tvDetailCreditsStore = inject(TVDetailCreditsStore);
  private readonly tvDetailStore = inject(TVDetailStore);
  TVSearchSelectIsLoading$!: Observable<boolean>;
  TVDiscoverySelectIsLoading$!: Observable<boolean>;
  TVBookmarksSelectIsLoading$!: Observable<boolean>;
  TVDetailSelectIsLoading$!: Observable<boolean>;
  TVDetailCreditsSelectIsLoading$!: Observable<boolean>;

  //Person
  private readonly personDetailStore = inject(PersonDetailStore);
  personSearchSelectIsLoading$!: Observable<boolean>;
  personDetailSelectIsLoading$!: Observable<boolean>;

  //Trending movie-tv
  trendingMediaSelectIsLoading$!: Observable<boolean>;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
    this.initSelectors();
    this.initSubscriptions();
  }

  initSelectors(): void {
    //Auth
    this.authSelectIsLoading$ = this.store.select(
      AuthSelectors.selectIsLoading
    );
    this.authSelectIsLoadingForPasswordValidation$ = this.store.select(
      AuthSelectors.selectIsLoadingForPasswordValidation
    );
    this.authSelectIsLoadingForCurrentUser$ = this.store.select(
      AuthSelectors.selectIsLoadingForCurrentUser
    );

    //Movie
    this.movieSearchSelectIsLoading$ = this.store.select(
      SearchMovieSelectors.selectIsLoading
    );
    this.movieDiscoverySelectIsLoading$ = this.store.select(
      DiscoveryMovieSelectors.selectIsLoading
    );
    this.movieBookmarksSelectIsLoading$ = this.store.select(
      MovieBookmarkSelectors.selectIsLoading
    );
    this.movieDetailSelectIsLoading$ = this.movieDetailStore.selectIsLoading$;
    this.movieDetailCreditsSelectIsLoading$ =
      this.movieDetailCreditsStore.selectIsLoading$;

    //TV
    this.TVSearchSelectIsLoading$ = this.store.select(
      SearchTVSelectors.selectIsLoading
    );
    this.TVDiscoverySelectIsLoading$ = this.store.select(
      DiscoveryTVSelectors.selectIsLoading
    );
    this.TVBookmarksSelectIsLoading$ = this.store.select(
      TVBookmarkSelectors.selectIsLoading
    );
    this.TVDetailSelectIsLoading$ = this.tvDetailStore.selectIsLoading$;
    this.TVDetailCreditsSelectIsLoading$ =
      this.tvDetailCreditsStore.selectIsLoading$;

    //Person
    this.personSearchSelectIsLoading$ = this.store.select(
      SearchPeopleSelectors.selectIsLoading
    );
    this.personDetailSelectIsLoading$ = this.personDetailStore.selectIsLoading$;

    //Trending movie-tv
    this.trendingMediaSelectIsLoading$ =
      this.trendingMediaStore.selectIsLoading$;
  }
  initSubscriptions(): void {
    //not landing
    this.authSelectIsLoadingForPasswordValidation$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.movieSearchSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.movieBookmarksSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.TVSearchSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleIsLoading(isLoading);
      }
    );

    this.TVBookmarksSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleIsLoading(isLoading);
      }
    );

    this.personSearchSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.authSelectIsLoadingForCurrentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.movieDiscoverySelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading);
      });

    this.TVDiscoverySelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleIsLoading(isLoading);
      }
    );

    //landing
    this.authSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading, true);
      });

    this.movieDetailSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading, true);
      });

    this.movieDetailCreditsSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading, true);
      });

    this.TVDetailSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleIsLoading(isLoading, true);
      }
    );

    this.TVDetailCreditsSelectIsLoading$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((isLoading) => {
      this.toggleIsLoading(isLoading, true);
    });

    this.personDetailSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading, true);
      });

    this.trendingMediaSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleIsLoading(isLoading, true);
      });
  }

  toggleIsLoading(isLoading: boolean, isLanding: boolean = false) {
    this.toggleIsLoading$.next({ isLoading, isLanding });
  }
}
