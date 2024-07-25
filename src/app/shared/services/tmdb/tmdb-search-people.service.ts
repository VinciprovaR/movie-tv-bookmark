import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PeopleResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchPeopleService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

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
