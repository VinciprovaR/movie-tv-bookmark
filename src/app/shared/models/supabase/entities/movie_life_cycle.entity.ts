import { lifeCycleId } from '../../lifecycle.models';

type actionDelete = 'delete';

export const ACTION_DB_ENUM = {
  ActionDelete: 'delete' as actionDelete,
};

export interface Movie_Life_Cycle {
  id?: number;
  created_at?: string;
  user_id: string;
  movie_id: number;
  lifecycle_id: lifeCycleId;
}
