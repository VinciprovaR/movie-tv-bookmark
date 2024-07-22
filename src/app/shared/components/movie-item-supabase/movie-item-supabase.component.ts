import { Component, Input, OnInit } from '@angular/core';
import { MediaType, Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data } from '../../interfaces/supabase/entities';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-movie-item-supabase',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './movie-item-supabase.component.html',
  styleUrl: './movie-item-supabase.component.css',
})
export class MovieItemSupabaseComponent {
  @Input({ alias: 'mediaData', required: true })
  movieData!: Movie_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  constructor() {}
}
