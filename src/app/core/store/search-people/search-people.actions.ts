import { createAction, props } from '@ngrx/store';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { PeopleResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

export const cleanState = createAction('[Search-people] Clean State');

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
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
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
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const noAdditionalPeople = createAction(
  '[Search-people] No Additional People'
);
