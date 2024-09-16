import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MainCrewCast } from '../../interfaces/TMDB/tmdb-media.interface';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-main-crew-cast',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent, RouterLink],
  templateUrl: './main-crew-cast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCrewCastComponent extends AbstractComponent implements OnInit {
  @Input({ required: true })
  mainCastCrewList: MainCrewCast[] = [];
  @Input({ required: true })
  title: string = '';
  @Input({ required: true })
  isDark: boolean = false;

  placeholder: string = '';

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.placeholder = `No ${this.title.toLowerCase()} found for this movie`;
  }

  buildDetailPath(id: number): string {
    return `/person-detail/${id}`;
  }
}
