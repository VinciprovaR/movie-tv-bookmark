import { Observable } from 'rxjs';
import { TVDetail } from '../../../interfaces/TMDB/tmdb-media.interface';
import { TMDBService } from './tmdb.abstract.service';

export abstract class TMDBTVService extends TMDBService {
  constructor() {
    super();
  }

  tvDetail(tvId: number): Observable<TVDetail> {
    return this.httpClient.get<TVDetail>(
      `${this.tmdbBaseUrl}/tv/${tvId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
