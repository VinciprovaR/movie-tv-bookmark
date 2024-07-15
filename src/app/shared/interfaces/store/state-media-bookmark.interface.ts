import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../error.interface';

export interface StateMediaBookmark {
  isLoading: boolean;
  error: HttpErrorResponse | null;
}
