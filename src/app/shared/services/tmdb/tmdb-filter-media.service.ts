import { inject, Injectable } from '@angular/core';
import {
  Certification,
  CertificationResult,
  Genre,
  GenresResult,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { map, Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterMediaService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  retriveGenreMovieList(): Observable<Genre[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<GenresResult>({
        method: 'GET',
        pathKey: `genre-movie-list`,
        queryStrings: `language=en-US`,
      })
      .pipe(
        map((genreResult: GenresResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveCertificationMovieList(): Observable<Certification[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<CertificationResult>({
        method: 'GET',
        pathKey: `certification-movie-list`,
        queryStrings: ``,
      })
      .pipe(
        map((certificationResult: CertificationResult) => {
          //to-do i18e inietta origin
          return certificationResult.certifications['US'];
        })
      );
  }

  retriveGenreTVList(): Observable<Genre[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<GenresResult>({
        method: 'GET',
        pathKey: `genre-tv-list`,
        queryStrings: `language=en-US`,
      })
      .pipe(
        map((genreResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveLanguagesList(): Observable<Language[]> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<Language[]>({
      method: 'GET',
      pathKey: `configuration-languages`,
      queryStrings: ``,
    });
  }
}
