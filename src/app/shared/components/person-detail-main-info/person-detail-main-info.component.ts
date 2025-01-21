import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { PersonDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { AgePipe } from '../../pipes/age';
import { BiographyComponent } from '../biography/biography.component';
import { ExternalInfoComponent } from '../external-info/external-info.component';

@Component({
  selector: 'app-person-detail-main-info',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    BiographyComponent,
    AgePipe,
    ExternalInfoComponent,
  ],
  templateUrl: './person-detail-main-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailMainInfoComponent
  extends AbstractComponent
  implements OnInit
{
  @Input({ required: true })
  personDetail!: PersonDetail;

  readonly genders: { [key: number]: string } = {
    0: 'Not specified',
    1: 'Female',
    2: 'Male',
    3: 'Non-binary',
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toDate(date: string): Date {
    return new Date(date);
  }
}
