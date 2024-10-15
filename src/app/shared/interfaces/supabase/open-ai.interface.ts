import { MediaType } from '../TMDB/tmdb-media.interface';

export interface AskOpenAiResult {
  result: {
    title: string;
    type: MediaType;
  }[];
}
