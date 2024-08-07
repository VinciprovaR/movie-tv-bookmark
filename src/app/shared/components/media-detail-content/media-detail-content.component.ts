import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import {
  Certification,
  Genre,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import {
  Cast,
  Crew,
  MediaCredit,
  MovieDetail,
  ReleaseDate,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
import {
  FastAverageColorResult,
  FastAverageColorRgba,
} from 'fast-average-color';
import { PredominantImgColorService } from '../../services/predominant-img-color.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { StaticTagComponent } from '../static-tag/static-tag.component';
import { ImdbIconComponent } from '../../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../../tmdb-icon/tmdb-icon.component';
@Component({
  selector: 'app-media-detail-content',
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
  templateUrl: './media-detail-content.component.html',
  styleUrl: './media-detail-content.component.css',
})
export class MediaDetailContentComponent implements OnInit {
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  readonly predominantImgColorService = inject(PredominantImgColorService);

  private readonly destroyRef$ = inject(DestroyRef);

  destroyed$ = new Subject();
  predominantColorResultObs$!: Observable<FastAverageColorResult>;

  @Input({ required: true })
  mediaData!: MovieDetail | TVDetail;
  @Input({ required: true })
  mediaTitle: string = '';
  @Input({ required: true })
  releaseDate: string = '';
  @Input({ required: true })
  runtime: number = 0;
  @Input()
  headerMediaGradient: string = '';
  @Input()
  contentMediaGradient: string = '';
  @Input()
  textColorBlend: string = '';
  @Input()
  isDark: boolean = false;

  mainPersonMap: {
    directors: { id: number; name: string }[];
    witers: { id: number; name: string }[];
    casts: { id: number; name: string }[];
  } = {
    directors: [],
    witers: [],
    casts: [],
  };

  releaseDateObj!: ReleaseDate;
  certification: string = '';
  detailMediaPath: string = '';

  constructor() {}

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.populateCertification();
    this.buildMainCrewMap();
    this.buildMainCastMap();
  }

  buildMainCrewMap() {
    this.mediaData.credits.crew.forEach((crew: Crew) => {
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

  buildMainCastMap() {
    this.mediaData.credits.cast.slice(0, 5).forEach((cast: Cast) => {
      this.mainPersonMap.casts.push({ id: cast.id, name: cast.name });
    });
  }

  buildDetailPath(id: number): string {
    return `/person-detail/${id}`;
  }

  populateCertification() {
    for (let releaseDate of this.mediaData.release_dates.results) {
      //to-do i18e?
      if (releaseDate.iso_3166_1 === 'US') {
        this.releaseDateObj = releaseDate;
        this.certification = releaseDate.release_dates[0].certification;
      }
    }
    this.releaseDateObj = {
      iso_3166_1: '',
      release_dates: [
        {
          certification: '',
          descriptors: [],
          iso_639_1: '',
          note: '',
          release_date: '',
          type: -1,
        },
      ],
    };
  }
}
