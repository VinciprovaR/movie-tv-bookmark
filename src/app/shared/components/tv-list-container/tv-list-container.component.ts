import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TVItemComponent } from '../tv-item/tv-item.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { TV_Data } from '../../interfaces/supabase/entities';

@Component({
  selector: 'app-tv-list-container',
  standalone: true,
  imports: [CommonModule, TVItemComponent, NzFlexModule],
  templateUrl: './tv-list-container.component.html',
  styleUrl: './tv-list-container.component.css',
})
export class TVListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  tvList!: TV[] | TV_Data[];
  @Input({ required: true })
  mediaType!: MediaType;

  @Input()
  placeholder: string = 'No tv from the research';

  constructor() {}
  ngOnInit(): void {}
}
