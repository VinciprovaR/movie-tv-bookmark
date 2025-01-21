import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IMG_SIZES } from '../../../providers';
import { AbstractPersonCardComponent } from '../../abstract/components/abstract-person-card.component';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    ImgComponent,
  ],
  templateUrl: './person-card.component.html',
})
export class PersonCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  protected readonly TMDB_POSTER_W_780_IMG_URL = inject(
    IMG_SIZES.TMDB_POSTER_W_780_IMG_URL
  );

  @Input({ required: true })
  person!: Person;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.buildDetailPath(this.person.id);
  }

  isPersonEntity(person: object): person is Person {
    return (person as Person).known_for !== undefined;
  }
}
