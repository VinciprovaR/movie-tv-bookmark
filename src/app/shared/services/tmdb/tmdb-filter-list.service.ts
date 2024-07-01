import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { GenresResult } from '../../models/tmdb-filters.models';
import { MediaType, PeopleResult } from '../../models/media.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterListService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);
  constructor() {}

  retriveGenreMovieList(): Observable<GenresResult> {
    return this.retriveGenreMediaList('movie');
  }

  retriveGenreMediaList(mediaType: MediaType): Observable<GenresResult> {
    return this.httpClient.get<GenresResult>(
      `${this.tmdbBaseUrl}/genre/${mediaType}/list?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }

  retrivePeopleList(query: string): Observable<PeopleResult> {
    return this.httpClient.get<PeopleResult>(
      `${this.tmdbBaseUrl}/search/person/?query=${query}&language=en-US&&include_adult=false&api_key=${this.tmdbApiKey}`
    );
  }
}
