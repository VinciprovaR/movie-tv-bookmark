import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';

import { Cast, Crew } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractPersonCardComponent } from '../abstract/abstract-person-card.component';
import { ImgComponent } from '../img/img.component';
import { IMG_SIZES } from '../../../providers';

@Component({
  selector: 'app-cast-crew-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
    ImgComponent,
  ],
  templateUrl: './cast-crew-card.component.html',
  styleUrl: './cast-crew-card.component.css',
})
export class CastCrewCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  protected readonly TMDB_SEARCH_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL
  );
  protected readonly TMDB_SEARCH_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL
  );
  protected readonly TMDB_DETAIL_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_1X_IMG_URL
  );
  protected readonly TMDB_DETAIL_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_2X_IMG_URL
  );

  @Input({ required: true })
  castCrew!: Cast | Crew;

  override ngOnInit(): void {
    this.buildDetailPath(this.castCrew.id);
  }

  isCastEntity(cast: object): cast is Cast {
    return (cast as Cast).character !== undefined;
  }

  isCrewEntity(crew: object): crew is Crew {
    return (crew as Crew).job !== undefined;
  }
}
