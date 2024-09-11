import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDetailStore } from '../../shared/component-store';
import {
  MediaType,
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { CommonModule } from '@angular/common';
import { PersonMoviesComponent } from '../person-movies/person-movies.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { ExternalInfoComponent } from '../../shared/components/external-info/external-info.component';
import { AbstractMediaDetailComponent } from '../../shared/components/abstract/abstract-media-detail.component';
import { PersonDetailMainInfoContentComponent } from '../../shared/components/person-detail-main-info/person-detail-main-info.component';
import { PersonTVsComponent } from '../person-tv/person-tvs.component';

import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { ErrorMessageTemplateComponent } from '../../shared/components/error-message-template/error-message-template.component';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [
    CommonModule,
    PersonMoviesComponent,
    PersonTVsComponent,
    ImgComponent,
    ExternalInfoComponent,
    PersonDetailMainInfoContentComponent,
    ErrorMessageTemplateComponent,
  ],

  templateUrl: './person-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailComponent
  extends AbstractMediaDetailComponent
  implements OnInit, OnDestroy
{
  private readonly personDetailStore = inject(PersonDetailStore);

  selectPersonDetail$!: Observable<PersonDetail | null>;
  selectIsLoading$!: Observable<boolean>;
  error$!: Observable<CustomHttpErrorResponseInterface | null>;
  personDetailMovieCredits$!: Observable<PersonDetailMovieCredits>;
  personDetailTVCredits$!: Observable<PersonDetailTVCredits>;

  errorTitle: string = `Oops! We can't find the page you're looking for`;
  errorMessage: string = `It seems that this person detail you're searching for doesn't exist.`;

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

  initSelectors() {
    this.selectPersonDetail$ = this.personDetailStore.selectPersonDetail$;
    this.selectIsLoading$ = this.personDetailStore.selectIsLoading$;
    this.personDetailTVCredits$ =
      this.personDetailStore.selectpersonDetailTVCredits$;
    this.personDetailMovieCredits$ =
      this.personDetailStore.selectpersonDetailMovieCredits$;
    this.error$ = this.personDetailStore.selectError$;
  }

  searchPersonDetail() {
    this.personDetailStore.searchPersonDetail(this.personId);
  }

  ngOnDestroy(): void {
    this.personDetailStore.cleanPersonDetail();
  }
}
