import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PersonDetailStore } from '../../shared/store/component-store/person-detail-store.service';
import { PersonDetail } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CommonModule } from '@angular/common';

import { PersonDetailMovieCreditsComponent } from '../person-detail-movie-credits/person-detail-movie-credits.component';
import { PersonDetailTVCreditsComponent } from '../person-detail-tv-credits/person-detail-tv-credits.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { IMG_SIZES } from '../../providers';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonDetailMovieCreditsComponent,
    PersonDetailTVCreditsComponent,
    ImgComponent,
  ],
  providers: [PersonDetailStore],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css',
})
export class PersonDetailComponent implements OnInit {
  readonly TMDB_PROFILE_1X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_1X_IMG_URL);
  readonly TMDB_PROFILE_2X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_2X_IMG_URL);
  private readonly destroyRef$ = inject(DestroyRef);

  private readonly personDetailStore = inject(PersonDetailStore);

  destroyed$ = new Subject();

  selectPersonDetail$!: Observable<PersonDetail | null>;
  selectIsLoading$!: Observable<boolean>;

  @Input({ required: true })
  personId: number = 0;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.searchPersonDetail();
  }

  initSelectors() {
    this.selectPersonDetail$ = this.personDetailStore.selectPersonDetail$;
    this.selectIsLoading$ = this.personDetailStore.selectIsLoading$;
  }

  searchPersonDetail() {
    this.personDetailStore.searchPersonDetail(this.personId);
  }
}
