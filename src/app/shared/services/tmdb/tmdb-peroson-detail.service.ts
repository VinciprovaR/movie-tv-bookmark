import { Observable } from 'rxjs';
import { PersonDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

@Injectable({ providedIn: 'root' })
export class TMDBPersonDetailService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor() {}

  personDetail(personId: number): Observable<PersonDetail> {
    return this.httpClient.get<PersonDetail>(
      `${this.tmdbBaseUrl}/person/${personId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
