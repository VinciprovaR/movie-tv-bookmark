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
    sortByDiscovery: OptionFilter[];
    sortByBookmark: OptionFilter[];
  };
  tv: {
    genreList: Genre[];
    sortByDiscovery: OptionFilter[];
    sortByBookmark: OptionFilter[];
  };
  media: { languageList: Language[] };
}
