import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';
import { MediaCardComponent } from '../media-card/media-card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractComponent } from '../abstract/abstract-component.component';

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
  styleUrl: './media-list-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListContainerComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input({ required: true })
  isLoading!: boolean;
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | Movie_Data[] | TV[] | TV_Data[];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  placeholder!: string;
  @Input()
  scrollSelf: boolean = false;
  @Input()
  includeScrollEvents: boolean = true;
  @Input({ required: true })
  direction: 'horizontal' | 'vertical' = 'vertical';

  // @Input()
  // cardSize: 'md' | 'lg' = 'md';

  ulContainerClass: string = '';

  @Input()
  personIdentifier: string = '';

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {
    console.log(this.direction);
    this.placeholder = `No ${this.mediaType} were found that match your query.`;
  }

  ngAfterViewInit(): void {}

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
