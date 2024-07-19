import { Component, Input, OnInit } from '@angular/core';
import { MediaType, Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data } from '../../interfaces/supabase/entities';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.css',
})
export class MovieItemComponent implements OnInit {
  @Input({ alias: 'mediaData', required: true })
  movieData!: Movie | Movie_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  detailMediaPath: string = '';

  constructor() {}
  ngOnInit(): void {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/movie-detail/${this.movieData.id}`
    );
  }
}
