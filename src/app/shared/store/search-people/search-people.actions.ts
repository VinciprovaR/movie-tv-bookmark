import { createAction, props } from '@ngrx/store';
import { PeopleResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const searchPeople = createAction(
  '[Search-people] Search People Init',
  props<{ query: string }>()
);
export const searchPeopleSuccess = createAction(
  '[Search-people] Search People Success',
  props<{ peopleResult: PeopleResult }>()
);
export const searchPeopleFailure = createAction(
  '[Search-People] Search People Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

//search additional
export const searchAdditionalPeople = createAction(
  '[Search-people] Search Additional People'
);
export const searchAdditionalPeopleSuccess = createAction(
  '[Search-people] Search People Additional Success',
  props<{ peopleResult: PeopleResult }>()
);
export const searchAdditionalPeopleFailure = createAction(
  '[Search-People] Search People Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);
export const noAdditionalPeople = createAction(
  '[Search-people] No Additional People'
);
