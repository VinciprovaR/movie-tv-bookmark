import { inject, Injectable } from '@angular/core';
import {
  Certification,
  CertificationResult,
  Genre,
  GenresResult,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { map, Observable } from 'rxjs';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterMediaService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  retriveGenreMovieList(): Observable<Genre[]> {
    return this.httpClient
      .get<GenresResult>(
        `${this.tmdbBaseUrl}/genre/movie/list?language=en-US&api_key=${this.tmdbApiKey}`
      )
      .pipe(
        map((genreResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveCertificationMovieList(): Observable<Certification[]> {
    return this.httpClient
      .get<CertificationResult>(
        `${this.tmdbBaseUrl}/certification/movie/list?&api_key=${this.tmdbApiKey}`
      )
      .pipe(
        map((certificationResult: CertificationResult) => {
          //to-do i18e inietta origin
          return certificationResult.certifications['US'];
        })
      );
  }

  retriveGenreTVList(): Observable<Genre[]> {
    return this.httpClient
      .get<GenresResult>(
        `${this.tmdbBaseUrl}/genre/tv/list?language=en-US&api_key=${this.tmdbApiKey}`
      )
      .pipe(
        map((genreResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveLanguagesList(): Observable<Language[]> {
    return this.httpClient.get<Language[]>(
      `${this.tmdbBaseUrl}/configuration/languages?api_key=${this.tmdbApiKey}`
    );
  }
}
