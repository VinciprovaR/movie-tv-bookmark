import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AbstractMediaComponent } from '../../abstract/components/abstract-media.component';

@Component({
  selector: 'app-media-discovery',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './media-discovery.component.html',
})
export class MediaDiscoveryComponent extends AbstractMediaComponent {
  constructor() {
    super();
  }
}
