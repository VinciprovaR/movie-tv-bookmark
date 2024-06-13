import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchMultiSelectors } from '../../store/search-multi';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-list-container',
  standalone: true,
  imports: [],
  templateUrl: './list-container.component.html',
  styleUrl: './list-container.component.css',
})
export class ListContainerComponent implements OnInit {
  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMultiSelectors.selectIsLoading
  );

  selectMovie$: Observable<any> = this.store.select(
    SearchMultiSelectors.selectMovies
  );

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.selectMovie$.subscribe((result) => {
      console.log(result);
    });
  }
}
