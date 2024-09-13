import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MovieData, TVData } from '../../interfaces/supabase/entities';
import { MediaCardComponent } from '../media-card/media-card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.interface';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MediaCardComponent,
    InfiniteScrollModule,
    NoSearchFoundComponent,
    MatProgressSpinnerModule,
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

  // @Input()
  // cardSize: 'md' | 'lg' = 'md';

  ulContainerClass: string = '';

  @Input()
  personIdentifier: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.captionNotFound = this.captionNotFoundCustom
      ? this.captionNotFoundCustom
      : `We couldn't find any ${this.mediaType} matching your search. Try searching with different keywords`;
    this.titleNotFound = `No ${this.mediaType} found`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
