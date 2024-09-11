import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { Observable, takeUntil } from 'rxjs';
import { SearchMovieSelectors } from '../../shared/store/search-movie';
import { SearchTVSelectors } from '../../shared/store/search-tv';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthSelectors } from '../../shared/store/auth';
import { DiscoveryMovieSelectors } from '../../shared/store/discovery-movie';
import { MovieBookmarkSelectors } from '../../shared/store/movie-bookmark';
import { DiscoveryTVSelectors } from '../../shared/store/discovery-tv';
import { TVBookmarkSelectors } from '../../shared/store/tv-bookmark';
import { SearchPeopleSelectors } from '../../shared/store/search-people';
import {
  MovieDetailCreditsStore,
  MovieDetailStore,
  TVDetailCreditsStore,
  TVDetailStore,
  PersonDetailStore,
} from '../../shared/component-store';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './loading.component.html',
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
  authSelectIsLoadingForPasswordValidation$!: Observable<boolean>;
  authSelectIsLoadingForCurrentUser$!: Observable<boolean>;
  //Movie
  private readonly movieDetailCreditsStore = inject(MovieDetailCreditsStore);
  private readonly movieDetailStore = inject(MovieDetailStore);
  movieSearchSelectIsLoading$!: Observable<boolean>;
  movieDiscoverySelectIsLoading$!: Observable<boolean>;
  movieDiscoverySelectIsLoadingAdditional$!: Observable<boolean>;
  movieBookmarksSelectIsLoading$!: Observable<boolean>;
  movieDetailSelectIsLoading$!: Observable<boolean>;
  movieDetailCreditsSelectIsLoading$!: Observable<boolean>;

  //TV
  private readonly tvDetailCreditsStore = inject(TVDetailCreditsStore);
  private readonly tvDetailStore = inject(TVDetailStore);
  TVSearchSelectIsLoading$!: Observable<boolean>;
  TVDiscoverySelectIsLoading$!: Observable<boolean>;
  TVDiscoverySelectIsLoadingAdditional$!: Observable<boolean>;
  TVBookmarksSelectIsLoading$!: Observable<boolean>;
  TVDetailSelectIsLoading$!: Observable<boolean>;
  TVDetailCreditsSelectIsLoading$!: Observable<boolean>;

  //Person
  private readonly personDetailStore = inject(PersonDetailStore);
  personSearchSelectIsLoading$!: Observable<boolean>;
  personDetailSelectIsLoading$!: Observable<boolean>;

  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    this.initSelectors();
    this.initSubscriptions();
  }
  ngOnInit(): void {}

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
    this.movieDiscoverySelectIsLoadingAdditional$ = this.store.select(
      DiscoveryMovieSelectors.selectIsLoadingAdditional
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
    this.TVDiscoverySelectIsLoadingAdditional$ = this.store.select(
      DiscoveryTVSelectors.selectIsLoadingAdditional
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
  }
  initSubscriptions(): void {
    //not landing

    this.authSelectIsLoadingForPasswordValidation$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoadingForPasswordValidation) => {
        this.toggleLoadingBar(isLoadingForPasswordValidation);
      });

    this.movieSearchSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    this.movieDiscoverySelectIsLoadingAdditional$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoadingAdditional) => {
        this.toggleLoadingBar(isLoadingAdditional);
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

    this.TVDiscoverySelectIsLoadingAdditional$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((isLoadingAdditional) => {
      this.toggleLoadingBar(isLoadingAdditional);
    });

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

    this.authSelectIsLoadingForCurrentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading);
      });

    //landing

    this.TVDiscoverySelectIsLoading$.pipe(takeUntil(this.destroyed$)).subscribe(
      (isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      }
    );

    this.movieDiscoverySelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

    this.authSelectIsLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.toggleLoadingBar(isLoading, true);
      });

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
  }

  toggleLoadingBar(isLoading: boolean, isLanding: boolean = false) {
    // console.log('toggle loading', isLoading);
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
