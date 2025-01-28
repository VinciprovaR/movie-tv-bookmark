import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { searchType } from '../../interfaces/layout.interface';
import { CommonModule } from '@angular/common';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { TypeSuggestionComponent } from '../type-suggestion/type-suggestion.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-no-media',
  imports: [CommonModule, NoSearchFoundComponent, TypeSuggestionComponent],
  templateUrl: './no-media.component.html',
})
export class NoMediaComponent extends AbstractComponent {
  @Input({ required: true })
  searchType!: searchType;
  @Input({ required: true })
  query!: string;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  mediaTypeLbl!: string;
  noSearchFoundIcon!: string;
}
