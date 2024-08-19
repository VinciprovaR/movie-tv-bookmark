import { PeopleResult } from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface SearchPeopleState extends StateMediaBookmark {
  query: string;
  peopleResult: PeopleResult;
  noAdditional: boolean;
}
