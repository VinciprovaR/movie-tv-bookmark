import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Event, NavigationEnd, RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, takeUntil } from 'rxjs';
import { MovieDetailCreditsStore } from '../../../../core/component-store/movie-detail-credits.store.service';
import { MovieDetailStore } from '../../../../core/component-store/movie-detail-store.service';
import { AbstractMediaDetailCreditsComponent } from '../../../../shared/abstract/components/abstract-media-detail-credits.component';
import { CastCrewCreditCardComponent } from '../../../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { ErrorMessageTemplateComponent } from '../../../../shared/components/error-message-template/error-message-template.component';
import { ImgComponent } from '../../../../shared/components/img/img.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import {
  Banner,
  CastMovie,
  CrewMovie,
  MovieCredit,
  MovieDepartments,
  MovieDetail,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-movie-detail-credits',
  standalone: true,
  imports: [
    CommonModule,
    CastCrewCreditCardComponent,
    MatIconModule,
    ImgComponent,
    RouterLink,
    ErrorMessageTemplateComponent,
    DatePipe,
  ],

  templateUrl: './movie-detail-credits.component.html',
})
export class MovieDetailCreditsComponent
  extends AbstractMediaDetailCreditsComponent
  implements OnDestroy
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
  yearSub$ = new BehaviorSubject<string>('');
  year$!: Observable<string>;
  @Input()
  movieId: number = 0;
  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this movie detail credits you're searching for doesn't exist.`;
  detailMediaPath: string = '';
  crewLength: number = 0;
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
    this.registerEffects();
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
      this.bannerSub$.asObservable(),
      this.yearSub$.asObservable()
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

    const year$ = this.movieDetail$.pipe(
      map((movieDetail: MovieDetail | null) => {
        if (movieDetail) {
          return movieDetail.release_date;
        }
        return '';
      })
    );

    this.initDynamicSelectors(
      forCastList$,
      forMovieDepartments$,
      banner$,
      year$
    );

    this.searchMovieDetail();
  }

  initSelectors() {
    this.routerEvent$ = this.router.events;
    this.movieCredits$ = this.movieDetailCreditsStore.selectMovieCredits$;
    this.movieDetail$ = this.movieDetailstore.selectMovieDetail$;
    this.isLoading$ = this.movieDetailstore.selectIsLoading$;
    this.error$ = this.movieDetailstore.selectError$;
  }

  registerEffects() {
    effect(() => {
      if (this.pageEventService.$windowInnerWidth() > 640) {
        this.resetHideContainers();
      }
    });
  }

  initDynamicSelectors(
    forCastList$: Observable<CastMovie[]>,
    forMovieDepartments$: Observable<MovieDepartments[]>,
    forBanner$: Observable<Banner | null>,
    forYear$: Observable<string>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forMovieDepartments$;
    this.banner$ = forBanner$;
    this.year$ = forYear$;
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
    this.yearSub$.next(movieDetail.release_date);
  }

  buildCastObject(castList: CastMovie[]) {
    return [...castList];
  }

  buildCrewObject(crewList: CrewMovie[]) {
    const cl = [...crewList];
    this.departments.forEach((department) => {
      for (let i = cl.length - 1; i >= 0; --i) {
        this.crewLength++;
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

  buildDetailPath(id: number) {
    return `/movie-detail/${id}`;
  }

  ngOnDestroy(): void {
    this.movieDetailstore.cleanMovieDetail();
    this.movieDetailCreditsStore.cleanMovieDetailCredits();
  }
}
