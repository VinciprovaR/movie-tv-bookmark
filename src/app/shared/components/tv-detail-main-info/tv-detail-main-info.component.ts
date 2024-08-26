import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import {
  CastTV,
  CrewTV,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
import { RouterModule } from '@angular/router';
import { StaticTagComponent } from '../static-tag/static-tag.component';
import { ImdbIconComponent } from '../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../tmdb-icon/tmdb-icon.component';
import { MediaDetailMainInfoComponent } from '../abstract/abstract-media-detail-main-info.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { OverviewComponent } from '../overview/overview.component';
import { MainCrewCastComponent } from '../main-crew-cast/main-crew-cast.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tv-detail-main-info',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent,
    FormatMinutesPipe,
    RouterModule,
    StaticTagComponent,
    ImdbIconComponent,
    TmdbIconComponent,
    MissingFieldPlaceholderComponent,
    OverviewComponent,
    MainCrewCastComponent,
  ],
  templateUrl: './tv-detail-main-info.component.html',
  styleUrl: './tv-detail-main-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDetailMainInfoContentComponent
  extends MediaDetailMainInfoComponent
  implements OnInit
{
  @Input({ required: true })
  tvData!: TVDetail;
  @Input({ required: true })
  cast: CastTV[] = [];
  @Input({ required: true })
  crew: CrewTV[] = [];

  mainPersonMap: {
    creators: { id: number; name: string }[];
    casts: { id: number; name: string }[];
  } = {
    creators: [],
    casts: [],
  };

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.populateRating();
    this.buildMainCrewMap();
    this.buildMainCastMap();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  override buildMainCrewMap() {
    this.tvData.created_by.forEach((createdBy) => {
      this.mainPersonMap.creators.push({
        id: createdBy.id,
        name: createdBy.name,
      });
    });
  }
  override buildMainCastMap() {
    this.cast.slice(0, 5).forEach((cast: CastTV) => {
      this.mainPersonMap.casts.push({ id: cast.id, name: cast.name });
    });
  }

  override populateRating() {
    for (let contentRating of this.tvData.content_ratings.results) {
      //not i18e
      if (contentRating.iso_3166_1 === 'US') {
        this.rating = contentRating.rating;
      }
    }
  }
}
