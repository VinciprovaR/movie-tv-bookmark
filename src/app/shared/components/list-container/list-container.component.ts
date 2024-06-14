import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SearchMovieSelectors } from '../../store/search-movie';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Movie, MovieResult } from '../../models';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-list-container',
  standalone: true,
  imports: [CommonModule, ItemComponent],
  templateUrl: './list-container.component.html',
  styleUrl: './list-container.component.css',
})
export class ListContainerComponent implements OnInit {
  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMovieSelectors.selectIsLoading
  );

  selectMoviesResult$: Observable<MovieResult | null> = this.store.select(
    SearchMovieSelectors.selectMoviesResult
  );

  movies$: Observable<Movie[] | null> = this.selectMoviesResult$.pipe(
    map((movieResult) => {
      return movieResult?.results ? movieResult.results : null;
    })
  );

  constructor(private store: Store) {}
  ngOnInit(): void {}
}
