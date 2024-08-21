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
  CastTV,
  CrewTV,
  Job,
  Role,
  TVCredit,
  TVDepartments,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CastCrewCreditCardComponent } from '../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Event, RouterLink } from '@angular/router';
import {
  TVDetailStore,
  TVDetailCreditsStore,
} from '../../shared/component-store';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailCreditsComponent } from '../../shared/components/abstract/abstract-media-detail-credits.component';

@Component({
  selector: 'app-tv-detail-credits',
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

  templateUrl: './tv-detail-credits.component.html',
  styleUrl: './tv-detail-credits.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDetailCreditsComponent
  extends AbstractMediaDetailCreditsComponent
  implements OnInit, OnDestroy
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

  @Input()
  tvId: number = 0;

  isHideCastContainer: boolean = false;
  isHideCrewContainer: boolean = false;

  detailMediaPath: string = '';

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

  t1: number = 0;
  t2: number = 0;

  constructor() {
    super();
    this.initSelectors();
    this.initRouteSubscription();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  initRouteSubscription() {
    this.t1 = new Date().getTime();
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
      this.bannerSub$.asObservable()
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

    this.initDynamicSelectors(forCastList$, forTVDepartments$, banner$);

    this.searchTVDetail();
  }

  override initSelectors() {
    this.routerEvent$ = this.router.events;
    this.tvCredits$ = this.tvDetailCreditsStore.selectTVCredits$;
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
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
    forCastList$: Observable<CastTV[]>,
    forTVDepartments$: Observable<TVDepartments[]>,
    forBanner$: Observable<Banner | null>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forTVDepartments$;
    this.banner$ = forBanner$;
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
  }

  buildCastObject(castList: CastTV[]) {
    return [...castList];
  }

  buildCrewObject(crewList: CrewTV[]) {
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
