import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { forkJoin, map, Observable, takeUntil, tap } from 'rxjs';
import { SearchMovieSelectors } from '../../shared/store/search-movie';
import { SearchTVSelectors } from '../../shared/store/search-tv';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthSelectors } from '../../shared/store/auth';
import { DiscoveryMovieSelectors } from '../../shared/store/discovery-movie';
import { MovieBookmarkSelectors } from '../../shared/store/movie-bookmark';
import { DiscoveryTVSelectors } from '../../shared/store/discovery-tv';
import { TVBookmarkSelectors } from '../../shared/store/tv-bookmark';
import { SearchPeopleSelectors } from '../../shared/store/search-people';
import { MovieDetailCreditsStore } from '../../shared/store/component-store/movie-detail-credits.store.service';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { PersonDetailStore } from '../../shared/store/component-store/person-detail-store.service';
import { PersonDetailMovieCreditsStore } from '../../shared/store/component-store/person-detail-movie-credits-store.service';
import { PersonDetailTVCreditsStore } from '../../shared/store/component-store/person-detail-tv-credits-store.service';
import { TVDetailCreditsStore } from '../../shared/store/component-store/tv-detail-credits.store.service';
import { TVDetailStore } from '../../shared/store/component-store/tv-detail-store.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('loadingBar')
  loadingBar!: ElementRef;
  @ViewChild('loadingBarLanding')
  loadingBarLanding!: ElementRef;

  //Auth
  authSelectIsLoading$!: Observable<boolean>;

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
  private readonly personDetailMovieCreditsStore = inject(
    PersonDetailMovieCreditsStore
  );
  private readonly personDetailTVCreditsStore = inject(
    PersonDetailTVCreditsStore
  );
  personSearchSelectIsLoading$!: Observable<boolean>;
  personDetailSelectIsLoading$!: Observable<boolean>;
  personDetailMovieCreditsSelectIsLoading$!: Observable<boolean>;
  personDetailTVCreditsSelectIsLoading$!: Observable<boolean>;

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    this.initSelectors();
    this.initSubscriptions();
  }
  ngOnInit(): void {}

  override initSelectors(): void {
    //Auth
    this.authSelectIsLoading$ = this.store.select(
      AuthSelectors.selectIsLoading
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
    this.personDetailMovieCreditsSelectIsLoading$ =
      this.personDetailMovieCreditsStore.selectIsLoading$;
    this.personDetailTVCreditsSelectIsLoading$ =
      this.personDetailTVCreditsStore.selectIsLoading$;
  }
  override initSubscriptions(): void {
    //not landing
    this.authSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    this.movieSearchSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    this.movieDiscoverySelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    this.movieBookmarksSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    this.TVSearchSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleLoadingBar(isLoading);
      }
    );

    this.TVDiscoverySelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleLoadingBar(isLoading);
      }
    );

    this.TVBookmarksSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleLoadingBar(isLoading);
      }
    );

    this.personSearchSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    // landing
    this.movieDetailSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

    this.movieDetailCreditsSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

    this.TVDetailSelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      }
    );

    this.TVDetailCreditsSelectIsLoading$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((isLoading) => {
      this.toggleLoadingBar(isLoading, true);
    });

    this.personDetailSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

    this.personDetailMovieCreditsSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

    this.personDetailTVCreditsSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });
  }

  toggleLoadingBar(isLoading: boolean, isLanding: boolean = false) {
    if (isLoading) {
      if (isLanding) {
        this.renderer.removeClass(
          this.loadingBarLanding.nativeElement,
          'hidden'
        );
        this.renderer.addClass(this.loadingBarLanding.nativeElement, 'block');
      }

      this.renderer.removeClass(this.loadingBar.nativeElement, 'hidden');
      this.renderer.addClass(this.loadingBar.nativeElement, 'block');
    } else {
      if (isLanding) {
        this.renderer.addClass(this.loadingBarLanding.nativeElement, 'hidden');
        this.renderer.removeClass(
          this.loadingBarLanding.nativeElement,
          'block'
        );
      }

      this.renderer.removeClass(this.loadingBar.nativeElement, 'block');
      this.renderer.addClass(this.loadingBar.nativeElement, 'hidden');
    }
  }
}
