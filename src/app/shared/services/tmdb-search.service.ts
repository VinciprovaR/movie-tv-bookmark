import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../providers';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { MovieDetail, MovieResult, TVResult } from '../models';
import { MediaType, TVDetail } from '../models/media.models';
//https://api.themoviedb.org/3/search/movie?query=sam&include_adult=false&language=en-US&api_key=752d0986327eafd63e68291a07153a54
//https://api.themoviedb.org/3/search/movie?query=avenger&include_adult=false&language=en-US&page=1
@Injectable({
  providedIn: 'root',
})
export class TmdbSearchService {
  constructor(
    @Inject(TMDB_API_KEY) private tmdbApiKey: string,
    @Inject(TMDB_BASE_URL) private tmdbBaseUrl: string,
    private httpClient: HttpClient
  ) {}

  movieSearchInit(query: string) {
    return this.mediaSearch(1, query, 'movie') as Observable<MovieResult>;
  }

  additionalMovieSearch(page: number, query: string) {
    return this.mediaSearch(
      page + 1,
      query,
      'movie'
    ) as Observable<MovieResult>;
  }

  private mediaSearch(
    page: number,
    query: string,
    mediaType: MediaType
  ): Observable<MovieResult | TVResult> {
    return this.httpClient.get<MovieResult | TVResult>(
      `${this.tmdbBaseUrl}/search/${mediaType}?include_adult=false&language=en-US&query=${query}&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }

  searchMovieDetail(movieId: number) {
    return this.searchMediaDetail(movieId, 'movie') as Observable<MovieDetail>;
  }

  searchTVDetail(movieId: number) {
    return this.searchMediaDetail(movieId, 'tv') as Observable<TVDetail>;
  }

  private searchMediaDetail(
    mediaId: number,
    mediaType: MediaType
  ): Observable<MovieDetail | TVDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/${mediaType}/${mediaId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
