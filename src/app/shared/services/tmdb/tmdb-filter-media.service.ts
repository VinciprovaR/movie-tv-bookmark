import { Injectable, inject } from '@angular/core';
import { I18E } from '../../../providers';
import {
  Certification,
  CertificationResult,
  Genre,
  GenresResult,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { map, Observable } from 'rxjs';
import { TMDBService } from './abstract/tmdb.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterMediaService extends TMDBService {
  i18e: string = inject(I18E);

  constructor() {
    super();
  }

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
          return certificationResult.certifications[this.i18e];
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
