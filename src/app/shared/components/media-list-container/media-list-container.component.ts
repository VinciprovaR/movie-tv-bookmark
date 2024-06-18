import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../store/search-movie';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../models';
import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaType } from '../../models/media.models';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, MediaItemComponent],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit, OnDestroy {
  @Input()
  isLoading: boolean = false;
  @Input()
  mediaList!: Movie[] | TV[] | null;
  @Input()
  mediaType!: MediaType;
  @Input()
  changeLifecycle$!: Subject<{
    mediaId: number;
    lifeCycleId: number;
    index: number;
  }>;

  constructor(private store: Store) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    //to-do check if there are error
    this.store.dispatch(SearchMovieActions.cleanError());
  }
}
