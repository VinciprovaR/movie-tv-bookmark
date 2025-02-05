import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Event, NavigationEnd, RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, takeUntil } from 'rxjs';
import { TVDetailCreditsStore } from '../../../../core/component-store/tv-detail-credits.store.service';
import { TVDetailStore } from '../../../../core/component-store/tv-detail-store.service';
import { AbstractMediaDetailCreditsComponent } from '../../../../shared/abstract/components/abstract-media-detail-credits.component';
import { CastCrewCreditCardComponent } from '../../../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { ErrorMessageTemplateComponent } from '../../../../shared/components/error-message-template/error-message-template.component';
import { ImgComponent } from '../../../../shared/components/img/img.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import {
  Banner,
  CastTV,
  CrewTV,
  Job,
  Role,
  TVCredit,
  TVDepartments,
  TVDetail,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-tv-detail-credits',
  standalone: true,
  imports: [
    CommonModule,
    CastCrewCreditCardComponent,
    MatIconModule,
    ImgComponent,
    RouterLink,
    ErrorMessageTemplateComponent,
  ],
  templateUrl: './tv-detail-credits.component.html',
})
export class TVDetailCreditsComponent
  extends AbstractMediaDetailCreditsComponent
  implements OnDestroy
{
  private readonly tvDetailCreditsStore = inject(TVDetailCreditsStore);
  readonly tvDetailstore = inject(TVDetailStore);
  tvCredits$!: Observable<TVCredit | null>;
  tvDetail$!: Observable<TVDetail | null>;
  isLoading$!: Observable<boolean>;
  routerEvent$!: Observable<Event>;

  castListSub$ = new BehaviorSubject<CastTV[]>([]);
  castList$!: Observable<CastTV[]>;
  departmentsSub$ = new BehaviorSubject<TVDepartments[]>([]);
  departments$!: Observable<TVDepartments[]>;
  bannerSub$ = new BehaviorSubject<Banner | null>(null);
  banner$!: Observable<Banner | null>;
  error$!: Observable<CustomHttpErrorResponseInterface | null>;
  yearSub$ = new BehaviorSubject<string>('');
  year$!: Observable<string>;
  @Input()
  tvId: number = 0;
  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this tv detail credits you're searching for doesn't exist.`;
  detailMediaPath: string = '';
  crewLength: number = 0;
  departments: TVDepartments[] = [
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
          const tvDetail = currentNavigation.extras.state['data'] as TVDetail;

          this.handleDataFromRoute(tvDetail);
        } else {
          this.handleDataFromStore();
        }
      }
    });
  }

  handleDataFromRoute(tvDetail: TVDetail) {
    this.initDynamicSelectors(
      this.castListSub$.asObservable(),
      this.departmentsSub$.asObservable(),
      this.bannerSub$.asObservable(),
      this.yearSub$.asObservable()
    );

    this.pushTVDetail(tvDetail);
  }

  handleDataFromStore() {
    const forCastList$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildCastObject(tvDetail.aggregate_credits.cast);
        }
        return [];
      })
    );
    const forTVDepartments$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildCrewObject(tvDetail.aggregate_credits.crew);
        }
        return [];
      })
    );

    const banner$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildBanner(tvDetail);
        }
        return null;
      })
    );

    const year$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return tvDetail.first_air_date;
        }
        return '';
      })
    );

    this.initDynamicSelectors(forCastList$, forTVDepartments$, banner$, year$);

    this.searchTVDetail();
  }

  initSelectors() {
    this.routerEvent$ = this.router.events;
    this.tvCredits$ = this.tvDetailCreditsStore.selectTVCredits$;
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
    this.error$ = this.tvDetailstore.selectError$;
  }

  registerEffects() {
    effect(() => {
      if (this.pageEventService.$windowInnerWidth() > 640) {
        this.resetHideContainers();
      }
    });
  }

  initDynamicSelectors(
    forCastList$: Observable<CastTV[]>,
    forTVDepartments$: Observable<TVDepartments[]>,
    forBanner$: Observable<Banner | null>,
    forYear$: Observable<string>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forTVDepartments$;
    this.banner$ = forBanner$;
    this.year$ = forYear$;
  }

  searchTVCredits() {
    this.tvDetailCreditsStore.searchTVCredits(this.tvId);
  }

  searchTVDetail() {
    this.tvDetailstore.searchTVDetail(this.tvId);
  }

  pushTVDetail(tvDetail: TVDetail) {
    const departments = this.buildCrewObject(tvDetail.aggregate_credits.crew);
    const castList = this.buildCastObject(tvDetail.aggregate_credits.cast);
    const banner = this.buildBanner(tvDetail);
    this.castListSub$.next(castList);
    this.departmentsSub$.next(departments);
    this.bannerSub$.next(banner);
    this.yearSub$.next(tvDetail.first_air_date);
  }

  buildCastObject(castList: CastTV[]) {
    return [...castList];
  }

  buildCrewObject(crewList: CrewTV[]) {
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

  buildBanner(tvDetail: TVDetail): Banner {
    return {
      ...{
        id: tvDetail.id,
        poster_path: tvDetail.poster_path,
        title: tvDetail.name,
        backdrop_path: tvDetail.backdrop_path,
        release_date: tvDetail.first_air_date,
      },
    };
  }

  buildCharacterTV(roles: Role[]): string {
    let roleResult = '';
    roles.forEach((role: Role, i, array) => {
      if (i === array.length - 1) {
        roleResult = roleResult.concat(role.character);
      } else {
        roleResult = roleResult.concat(role.character, ' / ');
      }
    });
    return roleResult;
  }

  buildJobTV(jobs: Job[]): string {
    let roleResult = '';
    jobs.forEach((job: Job, i, array) => {
      if (i === array.length - 1) {
        roleResult = roleResult.concat(job.job);
      } else {
        roleResult = roleResult.concat(job.job, ' / ');
      }
    });
    return roleResult;
  }

  buildDetailPath(id: number) {
    return `/tv-detail/${id}`;
  }

  ngOnDestroy(): void {
    this.tvDetailCreditsStore.cleanTVDetailCredits();
  }
}
