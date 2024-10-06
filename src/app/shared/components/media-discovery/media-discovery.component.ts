import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-media-discovery',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './media-discovery.component.html',
  styleUrl: './media-discovery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDiscoveryComponent extends AbstractComponent {}
