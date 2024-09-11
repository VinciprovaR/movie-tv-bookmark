export type TimeWindow = 'day' | 'week';
export type MediaType = 'movie' | 'tv' | 'person';

export interface MediaResult {
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Media {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MediaDetail {
  adult: boolean;
  backdrop_path: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;

  video: boolean;

  videos: Videos;
}

export interface Movie extends Media {
  title: string;
  release_date: string;
}

export interface MovieResult extends MediaResult {
  results: Movie[];
}

export interface CastMovie {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  character: string;
  credit_id: string;
}

export interface CrewMovie {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieCredit {
  id: number;
  cast: CastMovie[];
  crew: CrewMovie[];
}

export interface MovieDetail extends MediaDetail {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  release_dates: ReleaseDates;
  keywords: KeywordsMovie;
  credits: MovieCredit;
  imdb_id: string;
}

interface Episode {
  id: number;
  overview: string;
  name: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}
export interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}
export interface CastTV {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: Role[];

  total_episode_count: number;
  order: number;
}

export interface Job {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface CrewTV {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  jobs: Job[];
  department: string;
  total_episode_count: number;
}

export interface TVCredit {
  id: number;
  cast: CastTV[];
  crew: CrewTV[];
}

export interface TVDetail extends MediaDetail {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    original_name: string;
    gender: number;
    profile_path: string;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode;
  networks: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  type: string;
  content_ratings: ContentRatings;
  keywords: KeywordsTV;
  aggregate_credits: TVCredit;
}

export interface ContentRatings {
  id: number;
  results: ContentRating[];
}

export interface ContentRating {
  descriptors: [];
  iso_3166_1: string;
  rating: string;
}

export interface TVResult extends MediaResult {
  results: TV[] | [];
}

export interface TV extends Media {
  name: string;
  first_air_date: string;
}

export interface PeopleResult {
  page: number;
  total_pages: number;
  results: Person[];
  total_results: number;
}

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: {
    backdrop_path: string;
    id: number;
    title?: string;
    name?: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }[];
}

export interface PersonDetail {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface PersonDetailMovieCredits {
  cast: Movie[];
  crew: Movie[];
}

export interface PersonDetailTVCredits {
  cast: TV[];
  crew: TV[];
}

export interface ReleaseDate {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    descriptors: any[];
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
  }[];
}

export interface ReleaseDates {
  id: number;
  results: ReleaseDate[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface Videos {
  id: number;
  results: Video[];
}

export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordsMovie {
  keywords: Keyword[];
}

export interface KeywordsTV {
  results: Keyword[];
}

export interface MainCrewCast {
  id: number;
  name: string;
}

export interface MovieDepartments {
  key: string;
  value: CrewMovie[];
}
export interface TVDepartments {
  key: string;
  value: CrewTV[];
}

export interface Banner {
  id: number;
  poster_path: string;
  title: string;
  backdrop_path: string;
  release_date: string;
}
