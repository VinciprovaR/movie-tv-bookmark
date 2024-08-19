import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractMediaCard } from '../abstract/abstract-media-card.component';
import { ImgComponent } from '../img/img.component';
import { RatingComponent } from '../rating/rating.component';
import { LifecycleStatusLabelComponent } from '../lifecycle-status-label/lifecycle-status-label.component';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { IMG_SIZES, LIFECYCLE_STATUS_MAP } from '../../../providers';
import { lifecycleEnum } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { BridgeDataService } from '../../services/bridge-data.service';

@Component({
  selector: 'app-media-card',
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
    RatingComponent,
    LifecycleStatusLabelComponent,
  ],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCardComponent extends AbstractComponent implements OnInit {
  protected readonly bridgeDataService = inject(BridgeDataService);
  protected readonly TMDB_SEARCH_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL
  );
  protected readonly TMDB_SEARCH_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL
  );
  protected readonly lifecycleStatusMap = inject(LIFECYCLE_STATUS_MAP);
  @Input({ required: true })
  media!: Movie | Movie_Data | TV | TV_Data;
  @Input({ required: true })
  index: number = 0;

  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personIdentifier: string = '';

  detailMediaPath: string = '';

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';

  voteIcon: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildDetailPath(this.media.id);
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  get voteAverage(): number | null {
    if (this.isTmdbMedia(this.media)) {
      return this.media.vote_average;
    }
    return null;
  }

  get title(): string {
    if (this.isMovie(this.media)) {
      return this.media.title;
    } else {
      return this.media.name;
    }
  }

  get releaseDate(): string {
    if (this.isMovie(this.media)) {
      return this.media.release_date;
    } else {
      return this.media.first_air_date;
    }
  }

  isTmdbMedia(media: object): media is Movie | TV {
    return (
      (media as Movie).vote_average !== undefined ||
      (media as TV).vote_average !== undefined
    );
  }

  isMovie(media: object): media is Movie | Movie_Data {
    return (
      (media as Movie).title !== undefined ||
      (media as Movie_Data).title !== undefined
    );
  }

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
  }

  setLifecycleStatusElement(lifecycleEnumSelected: lifecycleEnum) {
    this.lifecycleEnumSelected = lifecycleEnumSelected;
  }
}
