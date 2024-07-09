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
import { TMDBService } from './abstract/tmdb.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterTVService extends TMDBService {
  i18e: string = inject(I18E);

  constructor() {
    super();
  }

  retriveGenreTVList(): Observable<GenresResult> {
    return this.httpClient.get<GenresResult>(
      `${this.tmdbBaseUrl}/genre/tv/list?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }

  //to-do comune
  retriveLanguagesList(): Observable<Language[]> {
    return this.httpClient.get<Language[]>(
      `${this.tmdbBaseUrl}/configuration/languages?api_key=${this.tmdbApiKey}`
    );
  }
}
