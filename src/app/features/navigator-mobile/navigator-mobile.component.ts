import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigator-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navigator-mobile.component.html',
  styleUrl: './navigator-mobile.component.css',
})
export class NavigatorMobileComponent {
  @Input({ required: true })
  navElements!: NavElements;
  @Input({ required: true })
  hiddenNavMenu: boolean = true;

  constructor() {}
}
