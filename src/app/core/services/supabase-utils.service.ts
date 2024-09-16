import { Injectable } from '@angular/core';
import { BookmarkTypeIdMap } from '../../shared/interfaces/store/bookmark-metadata-state.interface';
import { BookmarkMetadata } from '../../shared/interfaces/supabase/bookmark-metadata.entity.interface';
import {
  BookmarkOption,
  MediaBookmarkDTO,
} from '../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { MovieBookmark } from '../../shared/interfaces/supabase/movie-bookmark.entity.interface';
import { MovieData } from '../../shared/interfaces/supabase/movie-data.entity.interface';
import {
  BookmarkCrudConditions,
  crud_operations,
} from '../../shared/interfaces/supabase/supabase-bookmark-crud-cases.interface';
import {
  MovieBookmarkMap,
  TVBookmarkMap,
} from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import { TVBookmark } from '../../shared/interfaces/supabase/tv-bookmark.entity.interface';
import { TVData } from '../../shared/interfaces/supabase/tv-data.entity.interface';
import { Genre } from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import {
  Movie,
  MovieDetail,
  MovieResult,
  TV,
  TVDetail,
  TVResult,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';

/**
 * SupabaseUtilsService utils methods and data decoupling of the
 * supabase entities
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseUtilsService {
  private readonly BOOKMARK_CASES: BookmarkCrudConditions = {
    noEntityANDInBookmarkSelected: 'create', //Case #0 - Create - Movie/tv doesn't have its own bookmark and bookmark selected is > 0, must create the bookmark item
    oneEntityANDNoBookmarkSelected: 'delete', //Case #1 - Delete - Movie/tv has its own bookmark and bookmark selected is == 0, must fake delete the bookmark item , update the bookmark to 0
    oneEntityANDInBookmarkSelected: 'update', //Case #2 - Update - Movie/tv has its own bookmark and bookmark selected is > 0, must update the bookmark item
    noEntityANDNoBookmarkSelected: 'unchanged', //Case #3 - Nothing - Movie/tv doesn't have its own bookmark and bookmark selected is == 0, must do nothing, count as delete return bookmark 0
    oneEntityANDInBookmarkSelectedButNoBookmarkInEntity: 'createUpdate', //  //Case #4 - Create Update - Movie/tv has its own bookmark, the bookmark is 0 and bookmark selected is > 0, must fake create the item, is an update
    default: 'default', //#Case #99/Default - Default - All cases covered, should not be possible
  };

  transformBookmarkMetadata(mediaBookmarkOptions: BookmarkMetadata[]): {
    bookmarkOptions: BookmarkOption[];
    bookmarkTypeIdMap: BookmarkTypeIdMap;
  } {
    let bookmarkOptions: BookmarkOption[] = [];
    let bookmarkTypeIdMap: BookmarkTypeIdMap = {};
    mediaBookmarkOptions.forEach((lc) => {
      bookmarkOptions.push({ label: lc.label, value: lc.enum });
      bookmarkTypeIdMap[lc.enum] = lc.enum;
    });

    return { bookmarkOptions, bookmarkTypeIdMap };
  }

  movieBookmarkMapFactory(
    movieBookmarkEntityList: MovieBookmark[] | (MovieBookmark[] & MovieData[])
  ): MovieBookmarkMap {
    let movieBookmarkMap: MovieBookmarkMap = {};
    movieBookmarkEntityList.forEach((movieBookmarkEntity) => {
      movieBookmarkMap[movieBookmarkEntity.movie_id] =
        movieBookmarkEntity.bookmark_enum;
    });
    return movieBookmarkMap;
  }

  movieDataObjFactory(movie: Movie | MovieData | MovieDetail): MovieData {
    let movieData: Partial<MovieData> = {
      id: movie.id,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      title: movie.title,
    };

    if (this.isMovieDetailEntity(movie)) {
      let genre_ids: number[] = movie.genres.map((genre: Genre) => {
        return genre.id;
      });

      movieData.genre_ids = genre_ids;
    } else {
      movieData.genre_ids = movie.genre_ids;
    }
    return movieData as MovieData;
  }

  private isMovieDetailEntity(movie: object): movie is MovieDetail {
    return (movie as MovieDetail).genres !== undefined;
  }

  tvBookmarkMapFactory(
    tvBookmarkEntityList: TVBookmark[] | (TVBookmark[] & TVData[])
  ): TVBookmarkMap {
    let tvBookmarkMap: TVBookmarkMap = {};
    tvBookmarkEntityList.forEach((tvBookmarkEntity) => {
      tvBookmarkMap[tvBookmarkEntity.tv_id] = tvBookmarkEntity.bookmark_enum;
    });
    return tvBookmarkMap;
  }

  tvDataObjFactory(tv: TV | TVData | TVDetail): TVData {
    let tvData: Partial<TVData> = {
      id: tv.id,
      poster_path: tv.poster_path,
      first_air_date: tv.first_air_date,
      name: tv.name,
    };

    if (this.isTVDetailEntity(tv)) {
      let genre_ids: number[] = tv.genres.map((genre: Genre) => {
        return genre.id;
      });

      tvData.genre_ids = genre_ids;
    } else {
      tvData.genre_ids = tv.genre_ids;
    }
    return tvData as TVData;
  }

  private isTVDetailEntity(tv: object): tv is TVDetail {
    return (tv as TVDetail).genres !== undefined;
  }

  removeMediaWithBookmark(
    entityMediaBookmark: MovieBookmark[] | TVBookmark[],
    mediaIdMapIndex: { [key: number]: number },
    mediaResult: MovieResult | TVResult
  ): MovieResult | TVResult {
    let indexListToRemove: number[] = [];
    entityMediaBookmark.forEach((mlc: MovieBookmark | TVBookmark) => {
      if (mlc.bookmark_enum != 'noBookmark') {
        if (this.isMovieEntity(mlc)) {
          indexListToRemove.push(mediaIdMapIndex[mlc.movie_id]);
        } else {
          indexListToRemove.push(mediaIdMapIndex[mlc.tv_id]);
        }
      }
    });
    indexListToRemove = indexListToRemove.sort((a, b) => b - a);

    indexListToRemove.forEach((indexToRemove) => {
      mediaResult.results.splice(indexToRemove, 1);
    });
    return mediaResult;
  }

  buildMediaIdListMap(
    mediaResult:
      | Movie[]
      | TV[]
      | MovieData[]
      | TVData[]
      | MovieDetail[]
      | TVDetail[]
  ): number[] {
    let mediaIdList: number[] = [];
    for (let media of mediaResult) {
      mediaIdList.push(media.id);
    }
    return mediaIdList;
  }

  buildMediaIdListMapIndex(mediaResult: MovieResult | TVResult): {
    mediaIdList: number[];
    mediaIdMapIndex: { [key: number]: number };
  } {
    let mediaIdList: number[] = [];
    let mediaIdMapIndex: { [key: number]: number } = {};
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
      mediaIdMapIndex[mediaResult.results[i].id] = i;
    }
    return { mediaIdList, mediaIdMapIndex };
  }

  checkCase(
    mediaBookmarkFromDB:
      | MovieBookmark[]
      | TVBookmark[]
      | (MovieBookmark[] & MovieData[])
      | (TVBookmark[] & TVData[]),
    mediaBookmarkDTO: MediaBookmarkDTO<
      Movie | MovieDetail | TV | TVDetail | TVData | MovieData
    >
  ): crud_operations {
    let isEntity = mediaBookmarkFromDB.length === 1;
    let isBookmarkSelected = mediaBookmarkDTO.bookmarkEnum != 'noBookmark';
    let isEntityButNoBookmarkInEntity = false;

    if (isEntity) {
      isEntityButNoBookmarkInEntity =
        mediaBookmarkFromDB[0].bookmark_enum === 'noBookmark';
    }

    let condition =
      (!isEntity && isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'noEntityANDInBookmarkSelected'
        : false) ||
      (isEntity && !isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'oneEntityANDNoBookmarkSelected'
        : false) ||
      (isEntity && isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'oneEntityANDInBookmarkSelected'
        : false) ||
      (isEntity && isBookmarkSelected && isEntityButNoBookmarkInEntity
        ? 'oneEntityANDInBookmarkSelectedButNoBookmarkInEntity'
        : false) ||
      (!isEntity && !isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'noEntityANDNoBookmarkSelected'
        : 'default');

    return this.BOOKMARK_CASES[condition];
  }

  isMovieEntity(
    entityMediaBookmark: object
  ): entityMediaBookmark is MovieBookmark {
    return (entityMediaBookmark as MovieBookmark).movie_id !== undefined;
  }
}
