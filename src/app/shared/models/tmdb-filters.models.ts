import { FormControl } from '@angular/forms';

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResult {
  genres: Genre[] | [];
}

export interface GenreControl {
  id: number;
  name: string;
  isSelected: boolean;
}

export interface GenreGroup {
  [key: string]: FormControl;
}

export interface SortEnum {
  [key: string]: string;
}
