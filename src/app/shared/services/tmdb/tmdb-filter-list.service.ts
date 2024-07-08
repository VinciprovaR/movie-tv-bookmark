import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { I18E, TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import {
  Certification,
  CertificationResult,
  Certifications,
  GenresResult,
  Language,
} from '../../interfaces/tmdb-filters.interface';
import { MediaType, PeopleResult } from '../../interfaces/media.interface';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterListService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);
  i18e: string = inject(I18E);

  constructor() {}

  retriveGenreMovieList(): Observable<GenresResult> {
    return this.retriveGenreMediaList('movie');
  }

  retriveCertificationMovieList(): Observable<Certification[]> {
    return this.retriveCertificationMediaList('movie');
  }

  retrivePeopleList(query: string): Observable<PeopleResult> {
    return this.httpClient.get<PeopleResult>(
      `${this.tmdbBaseUrl}/search/person/?query=${query}&language=en-US&&include_adult=false&api_key=${this.tmdbApiKey}`
    );
  }

  private retriveGenreMediaList(
    mediaType: MediaType
  ): Observable<GenresResult> {
    return this.httpClient.get<GenresResult>(
      `${this.tmdbBaseUrl}/genre/${mediaType}/list?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }

  private retriveCertificationMediaList(
    mediaType: MediaType
  ): Observable<Certification[]> {
    return this.httpClient
      .get<CertificationResult>(
        `${this.tmdbBaseUrl}/certification/${mediaType}/list?&api_key=${this.tmdbApiKey}`
      )
      .pipe(
        map((certificationResult: CertificationResult) => {
          //to-do i18e inietta origin
          return certificationResult.certifications[this.i18e];
        })
      );
  }

  retriveLanguagesList(): Observable<Language[]> {
    return this.httpClient.get<Language[]>(
      `${this.tmdbBaseUrl}/configuration/languages?api_key=${this.tmdbApiKey}`
    );
  }
}
