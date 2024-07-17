import { Component, inject, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { TMDB_RESIZED_IMG_URL } from '../../providers';
import {
  MediaCredit,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { Observable } from 'rxjs';
import { TVDetailStore } from '../../shared/store/component-store/tv-detail-store.service';
import { PeopleListContainerComponent } from '../../shared/components/people-list-container/people-list-container.component';

@Component({
  selector: 'app-tv-detail',
  standalone: true,
  imports: [CommonModule, PeopleListContainerComponent],
  providers: [TVDetailStore],
  templateUrl: './tv-detail.component.html',
  styleUrl: './tv-detail.component.css',
})
export class TVDetailComponent {
  readonly resizedImgUrl = inject(TMDB_RESIZED_IMG_URL);
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
