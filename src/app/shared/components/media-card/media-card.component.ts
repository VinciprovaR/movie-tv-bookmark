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
import { map, Observable, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { AuthSelectors } from '../../../core/store/auth';
import { IMG_SIZES, LIFECYCLE_STATUS_MAP } from '../../../providers';
import { AbstractCardComponent } from '../../abstract/components/abstract-card.component';
import { MovieData } from '../../interfaces/supabase/movie-data.entity.interface';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import { TVData } from '../../interfaces/supabase/tv-data.entity.interface';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { BookmarkDisabledDialogComponent } from '../bookmark-disabled-confirmation-dialog/bookmark-disabled-dialog.component';
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';
import { BookmarkStatusLabelComponent } from '../bookmark-status-label/bookmark-status-label.component';
import { ImgComponent } from '../img/img.component';
import { RatingComponent } from '../rating/rating.component';

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
    BookmarkStatusLabelComponent,
    BookmarkDisabledDialogComponent,
  ],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCardComponent
  extends AbstractCardComponent
  implements OnInit
{
  protected readonly bridgeDataService = inject(BridgeDataService);

  protected readonly TMDB_PROFILE_440W_660H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_440W_660H_IMG_URL
  );

  protected readonly TMDB_PROFILE_260W_390H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_260W_390H_IMG_URL
  );

  protected readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);

  isUserAuthenticated$!: Observable<boolean>;

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

  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';

  voteIcon: string = '';

  bookmarkSelectorAbsentIsOpen = false;

  override borderImgClassSm: string = 'border-img-card-media-sm';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
    this.buildDetailPath(this.media.id);
  }

  initSelectors(): void {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }

  initSubscriptions(): void {
    this.pageEventService.windowInnerWidth$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((windowWidth) => {
        this.evaluateCustomClasses(windowWidth);
      });
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

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    this.bookmarkEnumSelected = bookmarkEnumSelected;
  }

  toggleBookmarkAbsent() {
    this.bookmarkSelectorAbsentIsOpen = !this.bookmarkSelectorAbsentIsOpen;
  }
}
