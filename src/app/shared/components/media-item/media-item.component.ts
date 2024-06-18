import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MediaLifecycle, MediaType } from '../../models/media.models';
import { Subject } from 'rxjs';
import { Movie, TV } from '../../models';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.css',
})
export class MediaItemComponent implements OnInit {
  @Input()
  media!: Movie | TV;
  @Input()
  mediaType!: MediaType;
  @Input()
  index: number = 0;
  @Input()
  changeLifecycle$!: Subject<{
    mediaId: number;
    lifeCycleId: number;
    index: number;
  }>;

  moviePath: string = '/movie-detail';
  tvPath: string = '/tv-detail';
  detailMediaPath: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${this.media.id}`
    );
  }

  changeLifeCycle() {
    this.changeLifecycle$.next({
      mediaId: this.media.id,
      lifeCycleId: 1,
      index: this.index,
    });
  }

  goToDetail() {
    //this.router.navigate([`/movie-detail/${this.idMedia}`]);
  }
}
