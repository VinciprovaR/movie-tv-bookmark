import { Injectable, inject } from '@angular/core';
import { I18E } from '../../../providers';
import {
  Certification,
  CertificationResult,
  GenresResult,
  Language,
} from '../../interfaces/tmdb-filters.interface';
import { Observable, map } from 'rxjs';
import { TMDBService } from './abstract/tmdb.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterMovieService extends TMDBService {
  i18e: string = inject(I18E);

  constructor() {
    super();
  }

  retriveGenreMovieList(): Observable<GenresResult> {
    return this.httpClient.get<GenresResult>(
      `${this.tmdbBaseUrl}/genre/movie/list?language=en-US&api_key=${this.tmdbApiKey}`
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

  //to-do comune
  retriveLanguagesList(): Observable<Language[]> {
    return this.httpClient.get<Language[]>(
      `${this.tmdbBaseUrl}/configuration/languages?api_key=${this.tmdbApiKey}`
    );
  }
}
