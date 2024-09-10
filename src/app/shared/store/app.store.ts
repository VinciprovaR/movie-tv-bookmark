import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AuthReducers } from './auth';
import { SearchMovieReducers } from './search-movie';
import { SearchTVReducers } from './search-tv';
import { DiscoveryMovieReducers } from './discovery-movie';
import { AuthState } from '../interfaces/store/auth-state.interface';
import { DiscoveryMovieState } from '../interfaces/store/discovery-movie-state.interface';
import { SearchMovieState } from '../interfaces/store/search-movie-state.interface';
import { SearchTVState } from '../interfaces/store/search-tv-state.interface';
import { MovieBookmarkReducers } from './movie-bookmark';
import { TVBookmarkReducers } from './tv-bookmark';
import { MovieBookmarkState } from '../interfaces/store/movie-bookmark-state.interface';
import { TVBookmarkState } from '../interfaces/store/tv-bookmark-state.interface';
import { DiscoveryTVState } from '../interfaces/store/discovery-tv-state.interface';
import { DiscoveryTVReducers } from './discovery-tv';
import { BookmarkMetadataReducers } from './bookmark-metadata';
import { BookmarkMetadataState } from '../interfaces/store/bookmark-metadata-state.interface';
import { FiltersMetadataReducers } from './filters-metadata';
import { FiltersMetadataState } from '../interfaces/store/filters-metadata-state.interface';
import { SearchPeopleState } from '../interfaces/store/search-people-state.interface';
import { SearchPeopleReducers } from './search-people';

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
