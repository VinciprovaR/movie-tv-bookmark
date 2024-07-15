import { Observable } from 'rxjs';
import { MovieDetail } from '../../../interfaces/TMDB/tmdb-media.interface';
import { TMDBService } from './tmdb.abstract.service';

export abstract class TMDBMovieService extends TMDBService {
  constructor() {
    super();
  }

  movieDetail(movieId: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/movie/${movieId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
