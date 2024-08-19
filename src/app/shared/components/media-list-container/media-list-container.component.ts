import {
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
export class MediaListContainerComponent implements OnInit {
  @ViewChild('listContainer') listContainer!: ElementRef;

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
  minMaxCol: number = 160;
  @Input()
  scrollSelf: boolean = false;
  @Input()
  includeScrollEvents: boolean = true;
  @Input()
  direction: 'horizontal' | 'vertical' = 'vertical';

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

  @Input()
  personIdentifier: string = '';

  constructor() {}
  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

    this.placeholder = `No ${this.mediaType} were found that match your query.`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
