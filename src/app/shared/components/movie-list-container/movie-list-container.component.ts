import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

@Component({
  selector: 'app-movie-list-container',
  standalone: true,
  imports: [CommonModule, MovieItemComponent, NzFlexModule],
  templateUrl: './movie-list-container.component.html',
  styleUrl: './movie-list-container.component.css',
})
export class MovieListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  movieList!: Movie[] | Movie_Data[];
  @Input({ required: true })
  mediaType!: MediaType;

  @Input()
  placeholder: string = 'No movie from the research';

  constructor() {}
  ngOnInit(): void {}
}
