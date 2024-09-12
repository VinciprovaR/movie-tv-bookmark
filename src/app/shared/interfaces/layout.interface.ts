import { StateMediaBookmark } from './store/state-media-bookmark.interface';
import { Movie, TV } from './TMDB/tmdb-media.interface';

export type scrollDirection = 'horizontal' | 'vertical' | 'none';
export type confirm = 'confirm';
export type cancel = 'cancel';
export type submitDialogType = confirm | cancel;
export type scrollStrategies = 'block' | 'close' | 'noop' | 'reposition';
export type arrowType = 'up' | 'right' | 'down' | 'left';

export interface PredominantColor {
  headerMediaGradient: string;
  isDark: boolean;
  textColorBlend: string;
}

export interface RandomImageState extends StateMediaBookmark {
  randomImage: string;
  mediaResult: [Movie[], TV[]];
}

export interface ToggleThemeState {
  isDarkTheme: boolean;
  icon: string;
}

export interface SubmitDialog {
  typeSubmit: submitDialogType;
  payload?: any;
}
