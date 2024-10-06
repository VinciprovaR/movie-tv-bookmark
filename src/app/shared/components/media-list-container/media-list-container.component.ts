import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { scrollDirection } from '../../interfaces/layout.interface';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import { MediaCardComponent } from '../media-card/media-card.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MediaCardComponent,
    InfiniteScrollModule,
    NoSearchFoundComponent,
    MatProgressSpinnerModule,
    MissingFieldPlaceholderComponent,
  ],
  templateUrl: './media-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListContainerComponent
  extends AbstractComponent
  implements OnInit
{
  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input({ required: true })
  isLoading!: boolean;
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | MovieData[] | TV[] | TVData[];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  captionNotFoundCustom!: string;
  @Input()
  scrollSelf: boolean = false;
  @Input()
  includeScrollEvents: boolean = true;
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  allowButtonAdditionalMedia!: boolean;
  @Input()
  isMulti = false;
  titleNotFound!: string;
  captionNotFound!: string;
  ulContainerClass: string = '';
  noMoreAdditionalCaption: string = '';
  searchAdditionalButtonLabel: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    const mediaTypeLbl = this.isMulti ? 'movies or tv shows' : this.mediaType;
    this.searchAdditionalButtonLabel = `Search for additional ${mediaTypeLbl}`;
    this.captionNotFound = this.captionNotFoundCustom
      ? this.captionNotFoundCustom
      : `We couldn't find any ${mediaTypeLbl} matching your search. Try searching with different keywords`;
    this.titleNotFound = `No ${mediaTypeLbl} found`;
    this.noMoreAdditionalCaption = `There are no more additional ${mediaTypeLbl} for this query`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }

  evaluateMediaType(media: Movie | MovieData | TV | TVData): MediaType {
    if (this.isMulti && this.isMovie(media)) {
    } else {
    }

    return this.mediaType;
  }

  isMovie(media: object): media is Movie | MovieData {
    return (
      (media as Movie).title !== undefined ||
      (media as MovieData).title !== undefined
    );
  }
}
