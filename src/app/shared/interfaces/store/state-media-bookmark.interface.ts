import { HttpErrorResponse } from '@angular/common/http';

export interface StateMediaBookmark {
  isLoading: boolean;
  error: HttpErrorResponse | null;
}
