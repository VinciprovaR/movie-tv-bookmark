import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MediaType } from '../../models/media.models';
import { Subject } from 'rxjs';
import { Movie, TV } from '../../models';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [RouterModule, LifecycleSelectorComponent],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.css',
})
export class MediaItemComponent implements OnInit {
  @Input({ required: true })
  media!: Movie | TV;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  moviePath: string = '/movie-detail';
  tvPath: string = '/tv-detail';
  detailMediaPath: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log('item media', this.media);
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${this.media.id}`
    );
  }

  goToDetail() {
    //this.router.navigate([`/movie-detail/${this.idMedia}`]);
  }
}
