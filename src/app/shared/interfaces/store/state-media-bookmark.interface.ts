import { CustomHttpErrorResponseInterface } from '../customHttpErrorResponse.interface';

export interface StateMediaBookmark {
  isLoading: boolean;
  error: CustomHttpErrorResponseInterface | null;
}
