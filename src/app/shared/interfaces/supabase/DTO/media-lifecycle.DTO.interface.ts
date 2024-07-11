import { lifeCycleId } from '../../lifecycle.interface';

export interface MediaDataDTO {
  mediaId: number;
  poster_path: string;
  release_date: string;
  title: string;
}

export interface MediaLifecycleDTO {
  lifecycleId: lifeCycleId;
  index: number;
  mediaDataDTO: MediaDataDTO;
}

export interface LifecycleOption {
  label: string;
  value: lifeCycleId;
}
