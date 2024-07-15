import { FormControl, FormGroup } from '@angular/forms';

export interface DiscoveryMovieFilterForm {
  genres: FormGroup<GenreGroup>;
  sortBy: FormControl<string>;
  releaseDate: FormGroup<DateRangeGroup>;
  includeLifecycle: FormControl<boolean>;
  certifications: FormControl<string>;
  languages: FormControl<string>;
  voteAverage: FormGroup<VoteAverageGroup>;
}

export interface LifecycleMediaFilterForm {
  genres: FormGroup<GenreGroup>;
  sortBy: FormControl<string>;
}

export interface DiscoveryTVFilterForm {
  genres: FormGroup<GenreGroup>;
  sortBy: FormControl<string>;
  airDate: FormGroup<DateRangeGroup>;
  includeLifecycle: FormControl<boolean>;
  languages: FormControl<string>;
  voteAverage: FormGroup<VoteAverageGroup>;
  allEpisode: FormControl<boolean>;
}

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

export interface DateRangeGroup {
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}

export interface VoteAverageGroup {
  voteAverageMin: FormControl<number>;
  voteAverageMax: FormControl<number>;
}

export interface GenreGroup {
  [key: string]: FormControl<GenreControl>;
}
export interface GenreControl {
  id: number;
  name: string;
  isSelected: boolean;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface OptionFilter {
  value: string;
  label: string;
}

export interface SelectTransformConfig {
  valueKey: string;
  labelKey: string;
}
