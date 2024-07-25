import { Component, Input } from '@angular/core';
import { MediaType, Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-movie-item-tmdb',
  standalone: true,
  imports: [MediaCardComponent],
  templateUrl: './movie-item-tmdb.component.html',
  styleUrl: './movie-item-tmdb.component.css',
})
export class MovieItemTmdbComponent {
  @Input({ alias: 'mediaData', required: true })
  movieData!: Movie;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  constructor() {}
}
