import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
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
  CastTV,
  CrewTV,
  TVCredit,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { TVDetailCreditsStore } from '../../shared/store/component-store/tv-detail-credits.store.service';
import { CastCrewCreditCardComponent } from '../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Event, RouterLink } from '@angular/router';
import { TVDetailStore } from '../../shared/store/component-store/tv-detail-store.service';
import { ImgComponent } from '../../shared/components/img/img.component';
import { AbstractMediaDetailCreditsComponent } from '../../shared/components/abstract/abstract-media-detail-credits.component';

export interface Departments {
  key: string;
  value: CrewTV[];
}

export interface TVBanner {
  id: number;
  poster_path: string;
  title: string;
  backdrop_path: string;
  release_date: string;
}

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
  providers: [TVDetailCreditsStore, TVDetailStore],
  templateUrl: './tv-detail-credits.component.html',
  styleUrl: './tv-detail-credits.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDetailCreditsComponent
  extends AbstractMediaDetailCreditsComponent
  implements OnInit
{
  private readonly tvDetailCreditsStore = inject(TVDetailCreditsStore);
  readonly tvDetailstore = inject(TVDetailStore);
  tvCredits$!: Observable<TVCredit | null>;
  tvDetail$!: Observable<TVDetail | null>;
  isLoading$!: Observable<boolean>;
  routerEvent$!: Observable<Event>;

  castListSub$ = new BehaviorSubject<CastTV[]>([]);
  castList$!: Observable<CastTV[]>;
  departmentsSub$ = new BehaviorSubject<Departments[]>([]);
  departments$!: Observable<Departments[]>;
  tvBannerSub$ = new BehaviorSubject<TVBanner | null>(null);
  tvBanner$!: Observable<TVBanner | null>;

  @Input()
  tvId: number = 0;

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
    console.log('from route');

    this.initDynamicSelectors(
      this.castListSub$.asObservable(),
      this.departmentsSub$.asObservable(),
      this.tvBannerSub$.asObservable()
    );

    this.pushTVDetail(tvDetail);
  }

  handleDataFromStore() {
    console.log('from store');
    const forCastList$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildCastObject(tvDetail.aggregate_credits.cast);
        }
        return [];
      })
    );
    const forDepartments$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildCrewObject(tvDetail.aggregate_credits.crew);
        }
        return [];
      })
    );

    const tvBanner$ = this.tvDetail$.pipe(
      map((tvDetail: TVDetail | null) => {
        if (tvDetail) {
          return this.buildTVBanner(tvDetail);
        }
        return null;
      })
    );

    this.initDynamicSelectors(forCastList$, forDepartments$, tvBanner$);

    this.searchTVDetail();
  }

  initSelectors() {
    this.routerEvent$ = this.router.events;
    this.tvCredits$ = this.tvDetailCreditsStore.selectTVCredits$;
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
  }

  initSubscriptions() {
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
    forDepartments$: Observable<Departments[]>,
    forTVBanner$: Observable<TVBanner | null>
  ) {
    this.castList$ = forCastList$;
    this.departments$ = forDepartments$;
    this.tvBanner$ = forTVBanner$;
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
    const tvBanner = this.buildTVBanner(tvDetail);
    this.t2 = new Date().getTime();
    console.log(this.t2 - this.t1);
    this.castListSub$.next(castList);
    this.departmentsSub$.next(departments);
    this.tvBannerSub$.next(tvBanner);
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

  buildTVBanner(tvDetail: TVDetail): TVBanner {
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

  // private buildCharacterTV(cast: CastTV): string {
  //   let roleResult = '';
  //   cast.roles.forEach((role: Role, i, array) => {
  //     if (i === array.length - 1) {
  //       roleResult = roleResult.concat(role.character);
  //     } else {
  //       roleResult = roleResult.concat(role.character, ' / ');
  //     }
  //   });
  //   return roleResult;
  // }

  // private buildJobTV(crew: CrewTV): string {
  //   let roleResult = '';
  //   crew.jobs.forEach((job: Job, i, array) => {
  //     if (i === array.length - 1) {
  //       roleResult = roleResult.concat(job.job);
  //     } else {
  //       roleResult = roleResult.concat(job.job, ' / ');
  //     }
  //   });
  //   return roleResult;
  // }

  // private buildCharacterTV(cast: CastTV): string {
  //   return cast.character;
  // }

  // private buildJobTV(crew: CrewTV): string {
  //   return crew.job;
  // }

  buildDetailPath(id: number) {
    return `/tv-detail/${id}`;
  }
}
