import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-media-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './media-search.component.html',
  styleUrl: './media-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSearchComponent extends AbstractComponent {}
