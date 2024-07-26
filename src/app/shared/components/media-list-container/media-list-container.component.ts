import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';

import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';

import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

import { ListType } from '../../interfaces/list-type.type';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { TVCardComponent } from '../tv-card/tv-card.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, TVCardComponent],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit {
  readonly mediaItemComponents: any = {
    movie: MovieCardComponent,
    tv: TVCardComponent,
  };

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

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

  constructor() {}
  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

    this.placeholder = `No ${this.mediaType} were found that match your query.`;
  }
}
