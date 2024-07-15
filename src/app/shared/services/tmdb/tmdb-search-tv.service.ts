import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBTVService } from './abstract/tmdb-tv.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchTVService extends TMDBTVService {
  constructor() {
    super();
  }

  tvSearchInit(query: string): Observable<TVResult> {
    return this.tvSearch(1, query);
  }

  additionalTVSearch(page: number, query: string): Observable<TVResult> {
    return this.tvSearch(page + 1, query);
  }

  private tvSearch(page: number, query: string): Observable<TVResult> {
    return this.httpClient.get<TVResult>(
      `${this.tmdbBaseUrl}/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
