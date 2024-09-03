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
import { BehaviorSubject, map, Observable, takeUntil } from 'rxjs';
import { FadeScrollerDirective } from '../../shared/directives/fade-scroller.directive';
import {
  Banner,
  CastMovie,
  CrewMovie,
  MovieCredit,
  MovieDepartments,
  MovieDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CastCrewCreditCardComponent } from '../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Event, RouterLink } from '@angular/router';
import {
  MovieDetailStore,
  MovieDetailCreditsStore,
} from '../../shared/component-store';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailCreditsComponent } from '../../shared/components/abstract/abstract-media-detail-credits.component';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { ErrorMessageTemplateComponent } from '../../shared/components/error-message-template/error-message-template.component';

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
    ErrorMessageTemplateComponent,
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
  error$!: Observable<CustomHttpErrorResponseInterface | null>;

  castListSub$ = new BehaviorSubject<CastMovie[]>([]);
  castList$!: Observable<CastMovie[]>;
  departmentsSub$ = new BehaviorSubject<MovieDepartments[]>([]);
  departments$!: Observable<MovieDepartments[]>;
  bannerSub$ = new BehaviorSubject<Banner | null>(null);
  banner$!: Observable<Banner | null>;

  @Input()
  movieId: number = 0;

  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this movie detail credits you're searching for doesn't exist.`;

  isHideCastContainer: boolean = false;
  isHideCrewContainer: boolean = false;

  detailMediaPath: string = '';

  departments: MovieDepartments[] = [
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
    this.initDynamicSelectors(
      this.castListSub$.asObservable(),
      this.departmentsSub$.asObservable(),
      this.bannerSub$.asObservable()
    );

    this.pushMovieDetail(movieDetail);
  }

  handleDataFromStore() {
    const forCastList$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildCastObject(movieDetail.credits.cast);
        }
        return [];
      })
    );
    const forMovieDepartments$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildCrewObject(movieDetail.credits.crew);
        }
        return [];
      })
    );

    const banner$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return this.buildBanner(movieDetail);
        }
        return null;
      })
    );

    this.initDynamicSelectors(forCastList$, forMovieDepartments$, banner$);

    this.searchMovieDetail();
  }

  override initSelectors() {
    this.routerEvent$ = this.router.events;
    this.movieCredits$ = this.movieDetailCreditsStore.selectMovieCredits$;
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
    this.error$ = this.movieDetailstore.selectError$;
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
    forMovieDepartments$: Observable<MovieDepartments[]>,
    forBanner$: Observable<Banner | null>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forMovieDepartments$;
    this.banner$ = forBanner$;
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
    const banner = this.buildBanner(movieDetail);
    this.castListSub$.next(castList);
    this.departmentsSub$.next(departments);
    this.bannerSub$.next(banner);
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

  buildBanner(movieDetail: MovieDetail): Banner {
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
