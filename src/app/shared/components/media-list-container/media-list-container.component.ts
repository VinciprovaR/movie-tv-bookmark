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
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { scrollDirection } from '../../interfaces/layout.interface';
import { MediaCardComponent } from '../media-card/media-card.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MovieData } from '../../interfaces/supabase/movie-data.entity.interface';
import { TVData } from '../../interfaces/supabase/tv-data.entity.interface';

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
