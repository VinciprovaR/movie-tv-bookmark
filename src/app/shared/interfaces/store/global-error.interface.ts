import { CustomHttpErrorResponseInterface } from '../customHttpErrorResponse.interface';

export interface GlobalErrorState {
  error: CustomHttpErrorResponseInterface | null;
}
