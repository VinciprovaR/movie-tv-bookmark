import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from '../../shared/components/unauthorized-page/unauthorized.component';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [CommonModule, UnauthorizedComponent],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPageComponent extends AbstractComponent {
  @Input()
  pageName!: string;

  constructor() {
    super();
  }
}
