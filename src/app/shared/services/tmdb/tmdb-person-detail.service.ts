import { Observable } from 'rxjs';
import {
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';

@Injectable({ providedIn: 'root' })
export class TMDBPersonDetailService {
  protected readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  protected readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  protected readonly httpClient = inject(HttpClient);
  protected readonly TMDBMovieParamsUtilsService = inject(
    TMDBMovieParamsUtilsService
  );

  constructor() {}

  personDetail(personId: number): Observable<PersonDetail> {
    return this.httpClient.get<PersonDetail>(
      `${this.tmdbBaseUrl}/person/${personId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }

  personMovieCredit(personId: number): Observable<PersonDetailMovieCredits> {
    return this.httpClient.get<PersonDetailMovieCredits>(
      `${this.tmdbBaseUrl}/person/${personId}/movie_credits?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }

  personTVCredit(personId: number): Observable<PersonDetailTVCredits> {
    return this.httpClient.get<PersonDetailTVCredits>(
      `${this.tmdbBaseUrl}/person/${personId}/tv_credits?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
