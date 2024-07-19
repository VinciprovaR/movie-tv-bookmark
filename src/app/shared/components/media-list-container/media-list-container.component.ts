import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';
import { TVItemComponent } from '../tv-item/tv-item.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, NzFlexModule],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit {
  readonly mediaItemComponents = {
    movie: MovieItemComponent,
    tv: TVItemComponent,
  };

  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | Movie_Data[] | TV[] | TV_Data[];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  placeholder!: string;

  constructor() {}
  ngOnInit(): void {
    this.placeholder = `No ${this.mediaType} from the research`;
  }
}
