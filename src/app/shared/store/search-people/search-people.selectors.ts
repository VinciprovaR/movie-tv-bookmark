import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchPeopleReducer from './search-people.reducer';
import { SearchPeopleState } from '../../interfaces/store/search-people-state.interface';

const searchPeopleFeatureSelector = createFeatureSelector<SearchPeopleState>(
  SearchPeopleReducer.searchPeopleFeatureKey
);

export const selectSearchPeople = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getSearchPeopleState
);

export const selectIsLoading = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getIsLoading
);

export const selectQuery = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getQuery
);

export const selectPeopleResult = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getPeopleResult
);

export const selectPeopleList = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getPeopleList
);

export const selectPeoplePage = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getPeopleResultPage
);

export const selectPeopleTotalPages = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getPeopleResultTotalPages
);

export const selectError = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getSearchPeopleError
);

export const selectNoAdditional = createSelector(
  searchPeopleFeatureSelector,
  SearchPeopleReducer.getNoAdditional
);
