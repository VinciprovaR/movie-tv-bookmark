import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

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
  mediaList!: Movie[] | TV[] | Movie_Data[] | TV_Data[];
  @Input({ required: true })
  mediaType!: MediaType;

  constructor() {}
  ngOnInit(): void {}
}
