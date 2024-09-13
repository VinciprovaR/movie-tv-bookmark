import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-no-search-found',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './no-search-found.component.html',
  styleUrl: './no-search-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoSearchFoundComponent extends AbstractComponent {
  @Input({ required: true })
  title: string = '';
  @Input({ required: true })
  caption: string = '';
  @Input({ required: true })
  icon!: string;

  constructor() {
    super();
  }
}
