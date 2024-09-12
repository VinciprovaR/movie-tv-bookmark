import {
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PersonDetailState extends StateMediaBookmark {
  personDetail: PersonDetail | null;
  personDetailMovieCredits: PersonDetailMovieCredits;
  personDetailTVCredits: PersonDetailTVCredits;
  personId: number;
}
