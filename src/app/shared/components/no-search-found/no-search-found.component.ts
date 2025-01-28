import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { searchType } from '../../interfaces/layout.interface';

@Component({
  selector: 'app-no-search-found',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './no-search-found.component.html',
})
export class NoSearchFoundComponent
  extends AbstractComponent
  implements OnInit
{
  @Input({ required: true })
  mediaTypeLbl!: string;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  searchType!: searchType;
  icon!: string;
  title: string = '';
  caption: string = '';

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.title = `No ${this.mediaTypeLbl} found`;

    this.caption = `We couldn't find any ${this.mediaTypeLbl} matching your search. `;

    if (this.searchType === 'search') {
      this.caption = this.caption.concat(
        `Try searching with different keywords.`
      );
    } else if (this.searchType === 'discovery') {
      this.caption = this.caption.concat(
        `Try adjusting the filters to discover more options.`
      );
    } else if (this.searchType === 'bookmark') {
      this.caption = this.caption.concat(
        `Try adjusting the filters or add your favorite ${this.mediaTypeLbl} to find them here.`
      );
    }

    if (this.mediaType === 'person') {
      this.icon = 'person_off';
    } else {
      this.icon = 'tv_off';
    }
  }
}
