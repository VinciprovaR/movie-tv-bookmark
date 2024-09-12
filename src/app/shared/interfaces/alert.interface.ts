export type notificationType = 'error' | 'success';

export interface Alert {
  id: number;
  message: string;
  type: notificationType;
}

export interface AlertState {
  alerts: Alert[];
}
