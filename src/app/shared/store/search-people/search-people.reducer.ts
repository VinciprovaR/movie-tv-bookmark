import { createReducer, on } from '@ngrx/store';
import * as SearchPeopleActions from './search-people.actions';
import { SearchPeopleState } from '../../interfaces/store/search-people-state.interface';

export const searchPeopleFeatureKey = 'search-people';

export const initialState: SearchPeopleState = {
  isLoading: false,
  query: '',
  error: null,
  peopleResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
};

export const searchPeopleReducer = createReducer(
  initialState,
  on(SearchPeopleActions.searchAdditionalPeople, (state): SearchPeopleState => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),

  on(
    SearchPeopleActions.searchPeople,
    (state, { query }): SearchPeopleState => {
      return {
        ...state,
        query,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    SearchPeopleActions.searchPeopleSuccess,
    (state, { peopleResult }): SearchPeopleState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        peopleResult,
      };
    }
  ),
  on(
    SearchPeopleActions.searchAdditionalPeopleSuccess,
    (state, { peopleResult }): SearchPeopleState => {
      let currPeoples = state.peopleResult?.results
        ? state.peopleResult.results
        : [];
      let nextPeoples = peopleResult?.results ? peopleResult.results : [];
      return {
        ...state,
        error: null,
        isLoading: false,
        peopleResult: {
          page: peopleResult?.page ? peopleResult.page : 0,
          total_pages: peopleResult?.total_pages ? peopleResult.total_pages : 0,
          total_results: peopleResult?.total_results
            ? peopleResult.total_results
            : 0,
          results: [...currPeoples, ...nextPeoples],
        },
      };
    }
  ),
  on(SearchPeopleActions.noAdditionalPeople, (state): SearchPeopleState => {
    return {
      ...state,
      error: null,
      isLoading: false,
    };
  }),

  on(
    SearchPeopleActions.searchPeopleFailure,
    SearchPeopleActions.searchAdditionalPeopleFailure,
    (state, { httpErrorResponse }): SearchPeopleState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getSearchPeopleState = (state: SearchPeopleState) => state;
export const getIsLoading = (state: SearchPeopleState) => state.isLoading;
export const getQuery = (state: SearchPeopleState) => state.query;
export const getSearchPeopleError = (state: SearchPeopleState) => state.error;
export const getPeopleResult = (state: SearchPeopleState) => state.peopleResult;
export const getPeopleList = (state: SearchPeopleState) =>
  state.peopleResult.results;
export const getPeopleResultPage = (state: SearchPeopleState) =>
  state.peopleResult.page;

export const getPeopleResultTotalPages = (state: SearchPeopleState) =>
  state.peopleResult.total_pages;
