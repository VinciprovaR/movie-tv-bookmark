import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../../providers';

export abstract class TMDBService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor() {}
}
