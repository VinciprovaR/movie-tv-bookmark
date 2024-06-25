import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { SearchMovieActions } from '../../store/search-movie';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../models';
import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaType } from '../../models/media.models';
import { NzFlexModule } from 'ng-zorro-antd/flex';

import { NzWrap } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, MediaItemComponent, NzFlexModule],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit, OnDestroy {
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | TV[] | null;
  @Input({ required: true })
  mediaType!: MediaType;

  constructor(private store: Store) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    //to-do check if there are error
    this.store.dispatch(SearchMovieActions.cleanError());
  }
}
