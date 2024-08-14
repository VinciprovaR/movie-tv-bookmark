import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import {
  CastMovie,
  CrewMovie,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
import { RouterModule } from '@angular/router';
import { StaticTagComponent } from '../static-tag/static-tag.component';
import { ImdbIconComponent } from '../../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../../tmdb-icon/tmdb-icon.component';
import { MediaDetailMainInfoComponent } from '../abstract/abstract-media-detail-main-info.component';
@Component({
  selector: 'app-movie-detail-main-info',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent,
    FormatMinutesPipe,
    RouterModule,
    StaticTagComponent,
    ImdbIconComponent,
    TmdbIconComponent,
  ],
  templateUrl: './movie-detail-main-info.component.html',
  styleUrl: './movie-detail-main-info.component.css',
})
export class MovieDetailMainInfoContentComponent
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
    directors: { id: number; name: string }[];
    witers: { id: number; name: string }[];
    casts: { id: number; name: string }[];
  } = {
    directors: [],
    witers: [],
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
        this.mainPersonMap.witers.push({ id: crew.id, name: crew.name });
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
      //to-do i18e?
      if (releaseDate.iso_3166_1 === 'US') {
        this.rating = releaseDate.release_dates[0].certification;
      }
    }
  }
}
