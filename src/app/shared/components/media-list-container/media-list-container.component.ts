import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';

import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

import { MovieItemSupabaseComponent } from '../movie-item-supabase/movie-item-supabase.component';
import { MovieItemTmdbComponent } from '../movie-item-tmdb/movie-item-tmdb.component';
import { TVItemSupabaseComponent } from '../tv-item-supabase/tv-item-supabase.component';
import { TVItemTmdbComponent } from '../tv-item-tmdb/tv-item-tmdb.component';
import { ListType } from '../../interfaces/list-type.type';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, NzFlexModule],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit {
  readonly mediaItemComponents = {
    movie: {
      supabase: MovieItemSupabaseComponent,
      tmdb: MovieItemTmdbComponent,
    },
    tv: {
      supabase: TVItemSupabaseComponent,
      tmdb: TVItemTmdbComponent,
    },
  };

  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | Movie_Data[] | TV[] | TV_Data[];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  listType!: ListType;
  @Input()
  placeholder!: string;

  constructor() {}
  ngOnInit(): void {
    this.placeholder = `No ${this.mediaType} from the research`;
  }
}
