import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractPersonCardComponent } from '../abstract/abstract-person-card.component';
import { ImgComponent } from '../img/img.component';
import { IMG_SIZES } from '../../../providers';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    BookmarkSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
    ImgComponent,
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  protected readonly TMDB_PROFILE_260W_390H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_260W_390H_IMG_URL
  );

  protected readonly TMDB_PROFILE_440W_660H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_440W_660H_IMG_URL
  );

  @Input({ required: true })
  person!: Person;

  override ngOnInit(): void {
    this.buildDetailPath(this.person.id);
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  isPersonEntity(person: object): person is Person {
    return (person as Person).known_for !== undefined;
  }
}
