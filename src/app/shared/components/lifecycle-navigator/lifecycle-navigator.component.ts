import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LifecycleNavElement,
  LinkPath,
} from '../../interfaces/navigator.interface';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lifecycle-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './lifecycle-navigator.component.html',
  styleUrl: './lifecycle-navigator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent {
  @Input({ required: true })
  lifecycleNavElements!: LifecycleNavElement[];

  hiddenNavMenu: boolean = true;

  constructor() {}

  toggleNavMenu() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
  }
}
