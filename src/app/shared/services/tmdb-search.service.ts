import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../providers';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { MovieResult } from '../models';
//https://api.themoviedb.org/3/search/movie?query=sam&include_adult=false&language=en-US&api_key=752d0986327eafd63e68291a07153a54
//https://api.themoviedb.org/3/search/movie?query=avenger&include_adult=false&language=en-US&page=1
@Injectable({
  providedIn: 'root',
})
export class TmdbSearchService {
  readonly SEARCH_MOVIE_PATH = '/search/movie';
  constructor(
    @Inject(TMDB_API_KEY) private tmdbApiKey: string,
    @Inject(TMDB_BASE_URL) private tmdbBaseUrl: string,
    private httpClient: HttpClient
  ) {}

  searchInitMovie(searchMetadata: { query: string }) {
    return this.searchMovie(1, searchMetadata);
  }

  searchAdditionalMovie(page: number, query: string) {
    return this.searchMovie(page, { query });
  }

  searchMovie(
    page: number,
    searchMetadata: { query: string }
  ): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}${this.SEARCH_MOVIE_PATH}?include_adult=false&language=en-US&query=${searchMetadata.query}&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
