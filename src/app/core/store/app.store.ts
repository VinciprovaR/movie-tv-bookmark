import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AuthState } from '../../shared/interfaces/store/auth-state.interface';
import { BookmarkMetadataState } from '../../shared/interfaces/store/bookmark-metadata-state.interface';
import { DiscoveryMovieState } from '../../shared/interfaces/store/discovery-movie-state.interface';
import { DiscoveryTVState } from '../../shared/interfaces/store/discovery-tv-state.interface';
import { FiltersMetadataState } from '../../shared/interfaces/store/filters-metadata-state.interface';
import { MovieBookmarkState } from '../../shared/interfaces/store/movie-bookmark-state.interface';
import { SearchMovieState } from '../../shared/interfaces/store/search-movie-state.interface';
import { SearchPeopleState } from '../../shared/interfaces/store/search-people-state.interface';
import { SearchTVState } from '../../shared/interfaces/store/search-tv-state.interface';
import { TVBookmarkState } from '../../shared/interfaces/store/tv-bookmark-state.interface';
import { AuthReducers } from './auth';
import { BookmarkMetadataReducers } from './bookmark-metadata';
import { DiscoveryMovieReducers } from './discovery-movie';
import { DiscoveryTVReducers } from './discovery-tv';
import { FiltersMetadataReducers } from './filters-metadata';
import { MovieBookmarkReducers } from './movie-bookmark';
import { SearchMovieReducers } from './search-movie';
import { SearchPeopleReducers } from './search-people';
import { SearchTVReducers } from './search-tv';
import { TVBookmarkReducers } from './tv-bookmark';
import { AskAiReducers } from './ask-ai';
import { AskAiState } from '../../shared/interfaces/store/ask-ai-state.interface';

interface State {
  [AuthReducers.authFeatureKey]: AuthState;
  [SearchMovieReducers.searchMovieFeatureKey]: SearchMovieState;
  [SearchTVReducers.searchTVFeatureKey]: SearchTVState;
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]: DiscoveryMovieState;
  [DiscoveryTVReducers.discoveryTVFeatureKey]: DiscoveryTVState;
  [MovieBookmarkReducers.movieBookmarkStateFeatureKey]: MovieBookmarkState;
  [TVBookmarkReducers.tvBookmarkStateFeatureKey]: TVBookmarkState;
  [BookmarkMetadataReducers.bookmarkMetadataStateFeatureKey]: BookmarkMetadataState;
  [FiltersMetadataReducers.filtersMetadataFeatureKey]: FiltersMetadataState;
  [SearchPeopleReducers.searchPeopleFeatureKey]: SearchPeopleState;
  [AskAiReducers.askAiFeatureKey]: AskAiState;
}

export const reducers: ActionReducerMap<State> = {
  [AuthReducers.authFeatureKey]: AuthReducers.authReducer,
  [SearchMovieReducers.searchMovieFeatureKey]:
    SearchMovieReducers.searchMovieReducer,
  [SearchTVReducers.searchTVFeatureKey]: SearchTVReducers.searchTVReducer,
  [DiscoveryMovieReducers.discoveryMovieFeatureKey]:
    DiscoveryMovieReducers.discoveryMovieReducer,
  [DiscoveryTVReducers.discoveryTVFeatureKey]:
    DiscoveryTVReducers.discoveryTVReducer,
  [MovieBookmarkReducers.movieBookmarkStateFeatureKey]:
    MovieBookmarkReducers.movieBookmarkReducer,
  [TVBookmarkReducers.tvBookmarkStateFeatureKey]:
    TVBookmarkReducers.tvBookmarkReducer,
  [BookmarkMetadataReducers.bookmarkMetadataStateFeatureKey]:
    BookmarkMetadataReducers.BookmarkMetadataReducer,
  [FiltersMetadataReducers.filtersMetadataFeatureKey]:
    FiltersMetadataReducers.filtersMetadataReducer,
  [SearchPeopleReducers.searchPeopleFeatureKey]:
    SearchPeopleReducers.searchPeopleReducer,
  [AskAiReducers.askAiFeatureKey]: AskAiReducers.askAiReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [];

function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}
