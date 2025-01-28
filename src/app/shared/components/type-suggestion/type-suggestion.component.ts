import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { MatIconModule } from '@angular/material/icon';
import { searchType } from '../../interfaces/layout.interface';

@Component({
  selector: 'app-type-suggestion',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './type-suggestion.component.html',
})
export class TypeSuggestionComponent
  extends AbstractComponent
  implements OnInit
{
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  searchType!: searchType;
  @Input({ required: true })
  mediaTypeLbl!: string;

  suggestions!: {
    [key: string]: { icon: string; text: string; subText: string };
  };

  ngOnInit(): void {
    this.suggestions = {
      search: {
        icon: 'keyboard',
        text: `Type something in the search bar to find new ${this.mediaTypeLbl}!`,
        subText: `You can explore ${this.mediaTypeLbl} by entering a keyword.`,
      },
      AI: {
        icon: 'keyboard',
        text: `Ask the AI search bar to find ${this.mediaTypeLbl}!`,
        subText: `Type a keyword or a specific title, and let the AI recommend the best ${this.mediaTypeLbl} for you.`,
      },
    };
  }
}
