import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchTVService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

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
