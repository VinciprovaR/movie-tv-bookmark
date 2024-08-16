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
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { TVCardComponent } from '../tv-card/tv-card.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    TVCardComponent,
    InfiniteScrollModule,
    MissingFieldPlaceholderComponent,
  ],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListContainerComponent implements OnInit {
  readonly mediaItemComponents: any = {
    movie: MovieCardComponent,
    tv: TVCardComponent,
  };

  @ViewChild('listContainer') listContainer!: ElementRef;

  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input()
  isLoading: boolean = false;
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

  constructor() {}
  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.mediaList);
    }, 2000);

    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

    this.placeholder = `No ${this.mediaType} were found that match your query.`;
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }
}
