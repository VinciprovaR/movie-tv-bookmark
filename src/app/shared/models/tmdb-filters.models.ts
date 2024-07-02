import { FormControl, FormGroup } from '@angular/forms';

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResult {
  genres: Genre[] | [];
}

export interface DiscoveryFilterForm {
  genres: FormGroup<GenreGroup>;
  sortBy: FormControl<string>;
  releaseDate: FormGroup<ReleaseDateGroup>;
  includeLifecycle: FormControl<boolean>;
}

export interface ReleaseDateGroup {
  from: FormControl<Date | null>;
  to: FormControl<Date>;
}

export interface GenreGroup {
  [key: string]: FormControl<GenreControl>;
}
export interface GenreControl {
  id: number;
  name: string;
  isSelected: boolean;
}

export interface SortEnum {
  [key: string]: string;
}
