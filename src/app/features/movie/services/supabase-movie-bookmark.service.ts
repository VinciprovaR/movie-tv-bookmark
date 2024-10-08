import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { map, Observable, of, switchMap } from 'rxjs';
import { SupabaseUtilsService } from '../../../core/services/supabase-utils.service';
import { PayloadMovieBookmark } from '../../../shared/interfaces/store/movie-bookmark-state.interface';
import { MediaBookmarkDTO } from '../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { MovieBookmark } from '../../../shared/interfaces/supabase/movie-bookmark.entity.interface';
import { MovieData } from '../../../shared/interfaces/supabase/media-data.entity.interface';
import { crud_operations } from '../../../shared/interfaces/supabase/supabase-bookmark-crud-cases.interface';
import {
  Movie,
  MovieDetail,
  MovieResult,
} from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { SupabaseMovieBookmarkDAO } from './supabase-movie-bookmark.dao';
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import {
  MovieBookmarkMap,
  movieBookmarkDTOType,
  bookmarkEnum,
} from '../../../shared/interfaces/supabase/supabase-bookmark.interface';

/**
 * SupabaseMovieBookmarkService init, find, create, update, delete bookmark
 * related to movies.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieBookmarkService {
  private readonly supabaseMovieBookmarkDAO = inject(SupabaseMovieBookmarkDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);
  private readonly supabaseMovieDataDAO = inject(SupabaseMovieDataDAO);

  initMovieBookmarkMapFromMovieResultTMDB(
    movieList: Movie[] | MovieData[] | MovieDetail[]
  ): Observable<MovieBookmarkMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(movieList);
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds(mediaIdList)
      .pipe(
        map((movieBookmarkEntityList: MovieBookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  initMovieBookmarkMapFromMovieResultSupabase(
    movieBookmarkEntityList: MovieBookmark[] | (MovieBookmark[] & MovieData[])
  ): Observable<MovieBookmarkMap> {
    return of(
      this.supabaseUtilsService.movieBookmarkMapFactory(movieBookmarkEntityList)
    );
  }

  removeMovieWithBookmark(movieResult: MovieResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(movieResult);
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds(mediaIdList)
      .pipe(
        map((entityMediaBookmark: MovieBookmark[]) => {
          return this.supabaseUtilsService.removeMediaWithBookmark(
            entityMediaBookmark,
            mediaIdMapIndex,
            movieResult
          ) as MovieResult;
        })
      );
  }

  findMovieByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadMovieBookmark
  ): Observable<MovieBookmark[] & MovieData[]> {
    return this.supabaseMovieBookmarkDAO.findMovieByBookmarkId(
      bookmarkEnum,
      payload
    );
  }

  crudOperationResolver(
    movieBookmarkDTO: MediaBookmarkDTO<movieBookmarkDTOType>
  ): Observable<crud_operations> {
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds([movieBookmarkDTO.mediaDataDTO.id])
      .pipe(
        map((movieBookmarkFromDB: MovieBookmark[]) => {
          let operation = this.supabaseUtilsService.checkCase(
            movieBookmarkFromDB,
            movieBookmarkDTO
          );
          if (operation === 'default') {
            throw new Error('Something went wrong. Case default');
          }
          return operation;
        })
      );
  }

  updateMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<movieBookmarkDTOType>
  ): Observable<MovieBookmarkMap> {
    return this.supabaseMovieBookmarkDAO
      .updateMovieBookmark(
        movieBookmarkDTO.bookmarkEnum,
        movieBookmarkDTO.mediaDataDTO.id
      )
      .pipe(
        map((movieBookmarkEntityList: MovieBookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  createMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<movieBookmarkDTOType>,
    user: User
  ): Observable<MovieBookmarkMap> {
    return this.supabaseMovieDataDAO
      .findByMovieId(movieBookmarkDTO.mediaDataDTO.id)
      .pipe(
        switchMap((movieDataEntityList: MovieData[]) => {
          if (movieDataEntityList.length === 0) {
            let movieData: MovieData =
              this.supabaseUtilsService.movieDataObjFactory(
                movieBookmarkDTO.mediaDataDTO
              );
            return this.supabaseMovieDataDAO.createMovieData(movieData);
          }
          return of(movieDataEntityList);
        }),
        switchMap(() => {
          return this.supabaseMovieBookmarkDAO.createMovieBookmark(
            movieBookmarkDTO.bookmarkEnum,
            movieBookmarkDTO.mediaDataDTO.id,
            user
          );
        }),
        map((movieBookmarkEntityList: MovieBookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  unchangedMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<Movie>,
    user: User
  ): Observable<MovieBookmarkMap> {
    let movieBookmarkFromDBCustom: MovieBookmark = {
      bookmark_enum: 'noBookmark',
      movie_id: movieBookmarkDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([movieBookmarkFromDBCustom]).pipe(
      map((movieBookmarkEntityList: MovieBookmark[]) => {
        return this.supabaseUtilsService.movieBookmarkMapFactory(
          movieBookmarkEntityList
        );
      })
    );
  }
}
