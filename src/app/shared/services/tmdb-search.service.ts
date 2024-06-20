import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../providers';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { MovieDetail, MovieResult } from '../models';
//https://api.themoviedb.org/3/search/movie?query=sam&include_adult=false&language=en-US&api_key=752d0986327eafd63e68291a07153a54
//https://api.themoviedb.org/3/search/movie?query=avenger&include_adult=false&language=en-US&page=1
@Injectable({
  providedIn: 'root',
})
export class TmdbSearchService {
  readonly SEARCH_MOVIE_PATH = '/search/movie';
  readonly MOVIE_DETAIL_PATH = '/movie';

  constructor(
    @Inject(TMDB_API_KEY) private tmdbApiKey: string,
    @Inject(TMDB_BASE_URL) private tmdbBaseUrl: string,
    private httpClient: HttpClient
  ) {}

  searchMoviesInit(query: string) {
    return this.searchMovies(1, query);
  }

  searchAdditionalMovies(page: number, query: string) {
    return this.searchMovies(page + 1, query);
  }

  searchMovies(page: number, query: string): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}${this.SEARCH_MOVIE_PATH}?include_adult=false&language=en-US&query=${query}&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }

  searchMovieDetail(movieId: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}${this.MOVIE_DETAIL_PATH}/${movieId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
