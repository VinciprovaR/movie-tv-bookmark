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
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.types';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MediaCardComponent,
    InfiniteScrollModule,
    MissingFieldPlaceholderComponent,
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
  @Input()
  placeholder!: string;
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
    this.placeholder = `No ${this.mediaType} were found that match your query.`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
