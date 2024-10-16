import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IMG_SIZES } from '../../../providers';
import { AbstractCardComponent } from '../../abstract/components/abstract-card.component';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';
import { ImgComponent } from '../img/img.component';
import { RatingComponent } from '../rating/rating.component';
import { BookmarkOption } from '../../interfaces/supabase/media-bookmark.DTO.interface';

@Component({
  selector: 'app-media-card',
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
    RatingComponent,
    BookmarkComponent,
  ],
  templateUrl: './media-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCardComponent
  extends AbstractCardComponent
  implements OnInit
{
  protected readonly TMDB_POSTER_W_342_IMG_URL = inject(
    IMG_SIZES.TMDB_POSTER_W_342_IMG_URL
  );

  protected readonly TMDB_POSTER_W_780_IMG_URL = inject(
    IMG_SIZES.TMDB_POSTER_W_780_IMG_URL
  );

  @Input({ required: true })
  media!: Movie | MovieData | TV | TVData;
  @Input({ required: true })
  index: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personIdentifier: string = '';
  @Input()
  isDetail: boolean = false;
  detailMediaPath: string = '';
  voteIcon: string = '';
  bookmarkSelectorAbsentIsOpen = false;
  bookmarkLabel: string = '';
  bookmarkClass: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildDetailPath(this.media.id);
  }

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

  isMovie(media: object): media is Movie | MovieData {
    return (
      (media as Movie).title !== undefined ||
      (media as MovieData).title !== undefined
    );
  }

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
    this.detectChanges();
  }

  toggleBookmarkAbsent() {
    this.bookmarkSelectorAbsentIsOpen = !this.bookmarkSelectorAbsentIsOpen;
  }

  setBookmarkLabel(bookmarkOption: BookmarkOption) {
    this.bookmarkLabel = bookmarkOption.label;
    this.bookmarkClass = bookmarkOption.class;
  }
}
