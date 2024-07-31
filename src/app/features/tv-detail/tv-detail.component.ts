import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import {
  MediaCredit,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { Observable } from 'rxjs';
import { TVDetailStore } from '../../shared/store/component-store/tv-detail-store.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { IMG_SIZES } from '../../providers';

@Component({
  selector: 'app-tv-detail',
  standalone: true,
  imports: [CommonModule, PersonListContainerComponent, ImgComponent],
  providers: [TVDetailStore],
  templateUrl: './tv-detail.component.html',
  styleUrl: './tv-detail.component.css',
})
export class TVDetailComponent {
  readonly TMDB_PROFILE_1X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_1X_IMG_URL);
  readonly TMDB_PROFILE_2X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_2X_IMG_URL);

  readonly tvDetailstore = inject(TVDetailStore);

  @Input({ required: true })
  tvId: number = 0;

  tvDetail$!: Observable<(TVDetail & MediaCredit) | null>;
  isLoading$!: Observable<boolean>;
  constructor() {}

  ngOnInit(): void {
    this.initSelectors();
    this.searchTVDetail();
  }

  searchTVDetail() {
    this.tvDetailstore.searchTVDetail(this.tvId);
  }

  initSelectors() {
    this.tvDetail$ = this.tvDetailstore.selectTVDetail$;
    this.isLoading$ = this.tvDetailstore.selectIsLoading$;
  }
}
