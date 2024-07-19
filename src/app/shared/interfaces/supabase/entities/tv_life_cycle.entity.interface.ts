import { lifecycleEnum } from '../supabase-lifecycle.interface';

export interface TV_Life_Cycle {
  id?: number;
  created_at?: string;
  user_id: string;
  tv_id: number;
  lifecycle_enum: lifecycleEnum;
  label?: string;
}
