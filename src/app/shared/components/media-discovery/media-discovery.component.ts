import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AbstractMediaComponent } from '../../abstract/components/abstract-media.component';

@Component({
  selector: 'app-media-discovery',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './media-discovery.component.html',
  styleUrl: './media-discovery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDiscoveryComponent extends AbstractMediaComponent {
  constructor() {
    super();
  }
}
