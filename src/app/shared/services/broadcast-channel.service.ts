import { Injectable } from '@angular/core';
import {
  SearchMovieSelectors,
  SearchMovieActions,
} from '../store/search-movie';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class BroadcastChannelService {
  bc = new BroadcastChannel('test_channel');

  constructor(private store: Store) {
    // this.bc.onmessage = (event) => {
    //   console.log('dispatch action per il broadcast');
    //   this.store.dispatch(event.data);
    // };
  }

  dispatchAction(action: any) {
    this.bc.postMessage(action);
  }
}
