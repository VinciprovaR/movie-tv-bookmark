import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonCardComponent } from '../../shared/components/person-card/person-card.component';
import { CastCrewCardComponent } from '../../shared/components/cast-crew-card/cast-crew-card.component';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { FadeScrollerDirective } from '../../shared/directives/fade-scroller.directive';
import {
  CastMovie,
  CrewMovie,
  MovieCredit,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieDetailCreditsStore } from '../../shared/store/component-store/movie-detail-credits.store.service';
import { CastCrewCreditCardComponent } from '../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Event, RouterLink } from '@angular/router';
import { MovieDetailStore } from '../../shared/store/component-store/movie-detail-store.service';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailCreditsComponent } from '../../shared/components/abstract/abstract-media-detail-credits.component';

export interface Departments {
  key: string;
  value: CrewMovie[];
}

export interface MovieBanner {
  id: number;
  poster_path: string;
  title: string;
  backdrop_path: string;
  release_date: string;
}

@Component({
  selector: 'app-movie-detail-credits',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    CastCrewCardComponent,
    FadeScrollerDirective,
    CastCrewCreditCardComponent,
    MatIconModule,
    ImgComponent,
    RouterLink,
  ],

  templateUrl: './movie-detail-credits.component.html',
  styleUrl: './movie-detail-credits.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailCreditsComponent
  extends AbstractMediaDetailCreditsComponent
  implements OnInit, OnDestroy
{
  private readonly movieDetailCreditsStore = inject(MovieDetailCreditsStore);
  readonly movieDetailstore = inject(MovieDetailStore);
  movieCredits$!: Observable<MovieCredit | null>;
  movieDetail$!: Observable<MovieDetail | null>;
  isLoading$!: Observable<boolean>;
  routerEvent$!: Observable<Event>;

  castListSub$ = new BehaviorSubject<CastMovie[]>([]);
  castList$!: Observable<CastMovie[]>;
  departmentsSub$ = new BehaviorSubject<Departments[]>([]);
  departments$!: Observable<Departments[]>;
  movieBannerSub$ = new BehaviorSubject<MovieBanner | null>(null);
  movieBanner$!: Observable<MovieBanner | null>;

  @Input()
  movieId: number = 0;

  isHideCastContainer: boolean = false;
  isHideCrewContainer: boolean = false;

  detailMediaPath: string = '';

  departments: Departments[] = [
    { key: 'Directing', value: [] },
    { key: 'Writing', value: [] },
    { key: 'Production', value: [] },
    { key: 'Sound', value: [] },
    { key: 'Art', value: [] },
    { key: 'Camera', value: [] },
    { key: 'Costume \u0026 Make-Up', value: [] },
    { key: 'Editing', value: [] },
    { key: 'Visual Effects', value: [] },
    { key: 'Crew', value: [] },
  ];

  constructor() {
    super();
    this.initSelectors();
    this.initRouteSubscription();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  initRouteSubscription() {
    this.routerEvent$.pipe(takeUntil(this.destroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentNavigation = this.router.getCurrentNavigation();
        if (currentNavigation?.extras?.state != undefined) {
          const movieDetail = currentNavigation.extras.state[
            'data'
          ] as MovieDetail;

          this.handleDataFromRoute(movieDetail);
        } else {
          this.handleDataFromStore();
        }
      }
    });
  }

  handleDataFromRoute(movieDetail: MovieDetail) {
    console.log('from route');

    this.initDynamicSelectors(
      this.castListSub$.asObservable(),
      this.departmentsSub$.asObservable(),
      this.movieBannerSub$.asObservable()
    );

    this.pushMovieDetail(movieDetail);
  }

  handleDataFromStore() {
    console.log('from store');
    const forCastList$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildCastObject(movieDetail.credits.cast);
        }
        return [];
      })
    );
    const forDepartments$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildCrewObject(movieDetail.credits.crew);
        }
        return [];
      })
    );

    const movieBanner$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildMovieBanner(movieDetail);
        }
        return null;
      })
    );

    this.initDynamicSelectors(forCastList$, forDepartments$, movieBanner$);

    this.searchMovieDetail();
  }

  override initSelectors() {
    this.routerEvent$ = this.router.events;
    this.movieCredits$ = this.movieDetailCreditsStore.selectMovieCredits$;
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
  }

  override initSubscriptions() {
    this.pageEventService.windowInnerWidth$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((innerWidth) => {
        if (innerWidth > 640) {
          this.resetHideContainers();
        }
      });
  }

  initDynamicSelectors(
    forCastList$: Observable<CastMovie[]>,
    forDepartments$: Observable<Departments[]>,
    forMovieBanner$: Observable<MovieBanner | null>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forDepartments$;
    this.movieBanner$ = forMovieBanner$;
  }

  searchMovieCredits() {
    // this.movieDetailCreditsStore.searchMovieCredits(this.movieId);
  }

  searchMovieDetail() {
    this.movieDetailstore.searchMovieDetail(this.movieId);
  }

  pushMovieDetail(movieDetail: MovieDetail) {
    const departments = this.buildCrewObject(movieDetail.credits.crew);
    const castList = this.buildCastObject(movieDetail.credits.cast);
    const movieBanner = this.buildMovieBanner(movieDetail);
    this.castListSub$.next(castList);
    this.departmentsSub$.next(departments);
    this.movieBannerSub$.next(movieBanner);
  }

  buildCastObject(castList: CastMovie[]) {
    return [...castList];
  }

  buildCrewObject(crewList: CrewMovie[]) {
    const cl = [...crewList];
    this.departments.forEach((department) => {
      for (let i = cl.length - 1; i >= 0; --i) {
        if (cl[i].department === department.key) {
          department.value.push(cl[i]);
          cl.splice(i, 1);
        }
      }
    });

    return this.departments;
  }

  buildMovieBanner(movieDetail: MovieDetail): MovieBanner {
    return {
      ...{
        id: movieDetail.id,
        poster_path: movieDetail.poster_path,
        title: movieDetail.title,
        backdrop_path: movieDetail.backdrop_path,
        release_date: movieDetail.release_date,
      },
    };
  }

  toggleCast() {
    if (window.innerWidth < 640) {
      this.isHideCastContainer = !this.isHideCastContainer;
    }
  }
  toggleCrew() {
    if (window.innerWidth < 640) {
      this.isHideCrewContainer = !this.isHideCrewContainer;
    }
  }

  resetHideContainers() {
    this.isHideCastContainer = false;
    this.isHideCrewContainer = false;
    this.changeDetectorRef.detectChanges();
  }

  buildDetailPath(id: number) {
    return `/movie-detail/${id}`;
  }

  ngOnDestroy(): void {
    this.movieDetailstore.cleanMovieDetail();
    this.movieDetailCreditsStore.cleanMovieDetailCredits();
  }
}
