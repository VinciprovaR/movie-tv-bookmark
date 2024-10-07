import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AbstractMediaComponent } from '../../abstract/components/abstract-media.component';

@Component({
  selector: 'app-media-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './media-search.component.html',
  styleUrl: './media-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSearchComponent extends AbstractMediaComponent {
  constructor() {
    super();
  }
}
