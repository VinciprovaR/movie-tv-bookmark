import { Component, Input } from '@angular/core';
import { from } from 'rxjs';
import { MediaType, Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data } from '../../interfaces/supabase/entities';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-movie-item-tmdb',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './movie-item-tmdb.component.html',
  styleUrl: './movie-item-tmdb.component.css',
})
export class MovieItemTmdbComponent {
  @Input({ alias: 'mediaData', required: true })
  movieData!: Movie ;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  constructor() {}
}
