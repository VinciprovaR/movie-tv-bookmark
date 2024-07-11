import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-movie-lifecycle-list',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './movie-lifecycle-list.component.html',
  styleUrl: './movie-lifecycle-list.component.css',
})
export class MovieLifecycleListComponent {
  constructor() {}

  searchMovieByLifecycle(lifecycleId: any) {
    console.log(lifecycleId);
  }
}
