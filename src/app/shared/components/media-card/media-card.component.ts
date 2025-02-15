import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
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
import { BookmarkComponent } from '../bookmark/bookmark.component';
import { ImgComponent } from '../img/img.component';
import { BookmarkOption } from '../../interfaces/supabase/media-bookmark.DTO.interface';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    ImgComponent,
    BookmarkComponent,
  ],
  templateUrl: './media-card.component.html',
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
  $bookmarkLabel: WritableSignal<string> = signal('');

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
  }

  toggleBookmarkAbsent() {
    this.bookmarkSelectorAbsentIsOpen = !this.bookmarkSelectorAbsentIsOpen;
  }

  setBookmarkLabel(bookmarkOption: BookmarkOption) {
    this.$bookmarkLabel.set(bookmarkOption.label);
  }
}
