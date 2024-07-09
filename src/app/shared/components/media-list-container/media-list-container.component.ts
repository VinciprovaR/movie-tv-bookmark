import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/media.interface';
import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaType } from '../../interfaces/media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [CommonModule, MediaItemComponent, NzFlexModule],
  templateUrl: './media-list-container.component.html',
  styleUrl: './media-list-container.component.css',
})
export class MediaListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | TV[];
  @Input({ required: true })
  mediaType!: MediaType;

  constructor() {}
  ngOnInit(): void {}

  //to-do cambiare
  retriveMediaTitle(media: TV | Movie) {
    if (this.isMovieEntity(media)) {
      return media.title;
    } else {
      return media.name;
    }
  }

  isMovieEntity(movie: object): movie is Movie {
    return (movie as Movie).title !== undefined;
  }
}
