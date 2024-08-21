import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeopleResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchPeopleService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  peopleSearchInit(query: string): Observable<PeopleResult> {
    return this.peopleSearch(1, query);
  }

  additionalPeopleSearch(
    page: number,
    query: string
  ): Observable<PeopleResult> {
    return this.peopleSearch(page + 1, query);
  }

  private peopleSearch(page: number, query: string): Observable<PeopleResult> {
    return this.httpClient.get<PeopleResult>(
      `${this.tmdbBaseUrl}/search/person?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
