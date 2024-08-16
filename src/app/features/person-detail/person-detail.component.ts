import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDetailStore } from '../../shared/store/component-store/person-detail-store.service';
import {
  MediaType,
  PersonDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CommonModule } from '@angular/common';

import { PersonMoviesComponent } from '../person-movies/person-movies.component';

import { ImgComponent } from '../../shared/components/img/img.component';
import { ExternalInfoComponent } from '../../shared/components/external-info/external-info.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { PersonTVsComponent } from '../person-movies copy/person-tvs.component';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonMoviesComponent,
    PersonTVsComponent,
    ImgComponent,
    ExternalInfoComponent,
  ],
  providers: [PersonDetailStore],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css',
})
export class PersonDetailComponent
  extends AbstractMediaDetailComponent
  implements OnInit
{
  private readonly personDetailStore = inject(PersonDetailStore);

  selectPersonDetail$!: Observable<PersonDetail | null>;
  selectIsLoading$!: Observable<boolean>;

  @Input({ required: true })
  personId: number = 0;

  mediaType: MediaType = 'person';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.searchPersonDetail();
  }

  override initSelectors() {
    this.selectPersonDetail$ = this.personDetailStore.selectPersonDetail$;
    this.selectIsLoading$ = this.personDetailStore.selectIsLoading$;
  }
  override initSubscriptions(): void {}

  searchPersonDetail() {
    this.personDetailStore.searchPersonDetail(this.personId);
  }
}
