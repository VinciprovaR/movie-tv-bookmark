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
  titleNotFound!: string;
  captionNotFound!: string;
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
  ulContainerClass: string = '';
  noMoreAdditionalCaption: string = '';
  searchAdditionalButtonLabel: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.searchAdditionalButtonLabel = `Search for additional ${this.mediaType}`;
    this.captionNotFound = this.captionNotFoundCustom
      ? this.captionNotFoundCustom
      : `We couldn't find any ${this.mediaType} matching your search. Try searching with different keywords`;
    this.titleNotFound = `No ${this.mediaType} found`;
    this.noMoreAdditionalCaption = `There are no more additional ${this.mediaType} for this query`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
