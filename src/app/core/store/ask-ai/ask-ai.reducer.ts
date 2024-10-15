import { createReducer, on } from '@ngrx/store';
import * as AskAiActions from './ask.ai.actions';
import { AskAiState } from '../../../shared/interfaces/store/ask-ai-state.interface';

export const askAiFeatureKey = 'ask-ai';

export const initialState: AskAiState = {
  isLoading: false,
  query: '',
  error: null,
  mediaResult: [],
};

export const askAiReducer = createReducer(
  initialState,
  on(AskAiActions.cleanState, (state): AskAiState => {
    return {
      ...initialState,
    };
  }),

  on(AskAiActions.askAi, (state, { query }): AskAiState => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(AskAiActions.askAiSuccess, (state, { mediaResult }): AskAiState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      mediaResult,
    };
  }),

  on(AskAiActions.askAiFailure, (state, { httpErrorResponse }): AskAiState => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
    };
  })
);

export const getAskAiState = (state: AskAiState) => state;
export const getIsLoading = (state: AskAiState) => state.isLoading;
export const getQuery = (state: AskAiState) => state.query;
export const getAskAiError = (state: AskAiState) => state.error;
export const getMediaResult = (state: AskAiState) => state.mediaResult;
