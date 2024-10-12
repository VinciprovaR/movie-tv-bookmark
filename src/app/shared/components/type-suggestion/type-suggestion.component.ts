import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-type-suggestion',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './type-suggestion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeSuggestionComponent
  extends AbstractComponent
  implements OnInit
{
  @Input({ required: true })
  mediaType!: MediaType;
  private readonly medias: any = {
    movie: 'movies',
    tv: 'tv shows',
    person: 'people',
  };
  media: string = '';

  ngOnInit(): void {
    this.media = this.medias[this.mediaType];
  }
}
