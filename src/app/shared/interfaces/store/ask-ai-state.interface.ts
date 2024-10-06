import { Movie, TV } from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface AskAiState extends StateMediaBookmark {
  query: string;
  mediaResult: Movie[] & TV[];
}
