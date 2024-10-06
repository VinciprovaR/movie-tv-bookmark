import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as AskAiReducer from './ask-ai.reducer';
import { AskAiState } from '../../../shared/interfaces/store/ask-ai-state.interface';

const askAiFeatureSelector = createFeatureSelector<AskAiState>(
  AskAiReducer.askAiFeatureKey
);

export const selectAskAi = createSelector(
  askAiFeatureSelector,
  AskAiReducer.getAskAiState
);

export const selectIsLoading = createSelector(
  askAiFeatureSelector,
  AskAiReducer.getIsLoading
);

export const selectQuery = createSelector(
  askAiFeatureSelector,
  AskAiReducer.getQuery
);

export const selectMediaResult = createSelector(
  askAiFeatureSelector,
  AskAiReducer.getMediaResult
);

export const selectError = createSelector(
  askAiFeatureSelector,
  AskAiReducer.getAskAiError
);
