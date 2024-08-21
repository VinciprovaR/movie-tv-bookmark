import { Observable } from 'rxjs';
import {
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TMDBPersonDetailService {
  private readonly TMDBMovieParamsUtilsService = inject(
    TMDBMovieParamsUtilsService
  );

  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

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
