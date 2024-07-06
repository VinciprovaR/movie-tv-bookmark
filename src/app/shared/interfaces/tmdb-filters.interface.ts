import { FormControl, FormGroup } from '@angular/forms';

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResult {
  genres: Genre[] | [];
}

export interface Certification {
  certification: string;
  meaning: string;
  order: number;
}

export interface Certifications {
  [key: string]: Certification[];
}

export interface CertificationResult {
  certifications: Certifications;
}

export interface DiscoveryFilterForm {
  genres: FormGroup<GenreGroup>;
  sortBy: FormControl<string>;
  releaseDate: FormGroup<ReleaseDateGroup>;
  includeLifecycle: FormControl<boolean>;
  certifications: FormControl<string | null>;
}

export interface ReleaseDateGroup {
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}

export interface GenreGroup {
  [key: string]: FormControl<GenreControl>;
}
export interface GenreControl {
  id: number;
  name: string;
  isSelected: boolean;
}

export interface SortBySelect {
  [key: string]: string;
}
