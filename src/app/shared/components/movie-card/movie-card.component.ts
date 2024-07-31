import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { Movie_Data } from '../../interfaces/supabase/entities';
import { Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractMediaCard } from '../abstract/abstract-media-card.component';
import { ImgComponent } from '../img/img.component';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
    ImgComponent,
    RatingComponent,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent extends AbstractMediaCard implements OnInit {
  @Input({ alias: 'media', required: true })
  movie!: Movie | Movie_Data;
  @Input({ required: true })
  index: number = 0;

  voteIcon: string = '';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.buildDetailPath(this.movie.id);
  }

  get voteAverage(): number | null {
    if (this.isMovieEntity(this.movie)) {
      return this.movie.vote_average;
    }
    return null;
  }

  isMovieEntity(movie: object): movie is Movie {
    return (movie as Movie).vote_average !== undefined;
  }
}
