import { StateMediaBookmark } from './store/state-media-bookmark.interface';
import { Movie, TV } from './TMDB/tmdb-media.interface';

export type scrollDirection = 'horizontal' | 'vertical' | 'none';
export type confirm = 'confirm';
export type cancel = 'cancel';
export type submitDialogType = confirm | cancel;
export type scrollStrategies = 'block' | 'close' | 'noop' | 'reposition';
export type arrowType = 'up' | 'right' | 'down' | 'left';
export type searchType =
  | 'search'
  | 'discovery'
  | 'bookmark'
  | 'AI'
  | 'person-movie-cast'
  | 'person-tv-cast'
  | 'person-movie-crew'
  | 'person-tv-crew'
  | 'no-hint';

export interface PredominantColor {
  headerMediaGradient: string;
  contentMediaGradient: string;
  isDark: boolean;
  textColorBlend: string;
}

export interface TrendingMediaState extends StateMediaBookmark {
  randomImage: string;
  mediaResult: { movie: Movie[]; tv: TV[] };
}

export interface ToggleThemeState {
  isDarkTheme: boolean;
  icon: string;
}

export interface SubmitDialog {
  typeSubmit: submitDialogType;
  payload?: any;
}

export interface Themes {
  [key: string]: { key: string; icon: string; class: string };
}
