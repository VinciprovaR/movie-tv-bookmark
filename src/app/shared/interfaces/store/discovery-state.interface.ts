export interface DateRange {
  from: string;
  to: string;
}

export interface VoteAverage {
  voteAverageMin: number;
  voteAverageMax: number;
}

export interface PayloadDiscovery {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithLifecycle: boolean;
  language: string;
  voteAverage: VoteAverage;
}
