import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MediaDetailMainInfoComponent } from '../../abstract/components/abstract-media-detail-main-info.component';
import {
  CastMovie,
  CrewMovie,
  MainCrewCast,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
import { MainCrewCastComponent } from '../main-crew-cast/main-crew-cast.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { OverviewComponent } from '../overview/overview.component';
import { RatingComponent } from '../rating/rating.component';
import { StaticTagComponent } from '../static-tag/static-tag.component';

@Component({
  selector: 'app-movie-detail-main-info',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent,
    FormatMinutesPipe,
    RouterModule,
    StaticTagComponent,
    MissingFieldPlaceholderComponent,
    OverviewComponent,
    MainCrewCastComponent,
  ],
  templateUrl: './movie-detail-main-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailMainInfoComponent
  extends MediaDetailMainInfoComponent
  implements OnInit
{
  @Input({ required: true })
  movieData!: MovieDetail;
  @Input({ required: true })
  cast: CastMovie[] = [];
  @Input({ required: true })
  crew: CrewMovie[] = [];
  @Input()
  runtime: number = 0;

  mainPersonMap: {
    directors: MainCrewCast[];
    writers: MainCrewCast[];
    casts: MainCrewCast[];
  } = {
    directors: [],
    writers: [],
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

  override buildMainCrewMap() {
    this.crew.forEach((crew: CrewMovie) => {
      let department = crew.department.toLowerCase();
      let job = crew.job.toLowerCase();
      if (department === 'director' || job === 'director') {
        this.mainPersonMap.directors.push({ id: crew.id, name: crew.name });
      }

      if (
        department === 'writer' ||
        department === 'writing' ||
        job === 'writer' ||
        job === 'writing'
      ) {
        this.mainPersonMap.writers.push({ id: crew.id, name: crew.name });
      }
    });
  }
  override buildMainCastMap() {
    this.cast.slice(0, 5).forEach((cast: CastMovie) => {
      this.mainPersonMap.casts.push({ id: cast.id, name: cast.name });
    });
  }

  override populateRating() {
    for (let releaseDate of this.movieData.release_dates.results) {
      //not i18e
      if (releaseDate.iso_3166_1 === 'US') {
        this.rating = releaseDate.release_dates[0].certification;
      }
    }
  }
}
