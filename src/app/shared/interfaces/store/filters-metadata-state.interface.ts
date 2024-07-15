import {
  Certification,
  Genre,
  Language,
  OptionFilter,
} from '../TMDB/tmdb-filters.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface FiltersMetadataState extends StateMediaBookmark {
  movie: {
    genreList: Genre[];
    certificationList: Certification[];
    sortBy: OptionFilter[];
  };
  tv: { genreList: Genre[]; sortBy: OptionFilter[] };
  media: { languageList: Language[] };
}
