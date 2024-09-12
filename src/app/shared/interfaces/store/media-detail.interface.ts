import {
  CastMovie,
  CastTV,
  CrewMovie,
  CrewTV,
  MovieCredit,
  MovieDetail,
  TVCredit,
  TVDetail,
} from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface MovieDetailCreditsState extends StateMediaBookmark {
  movieCredit: MovieCredit | null;
}

export interface MovieDetailState extends StateMediaBookmark {
  movieDetail: MovieDetail | null;
}

export interface TVDetailCreditsState extends StateMediaBookmark {
  tvCredit: TVCredit | null;
}

export interface TVDetailState extends StateMediaBookmark {
  tvDetail: TVDetail | null;
}
