import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  BookmarkNavElement,
  LinkPath,
} from '../../interfaces/navigator.interface';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bookmark-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './bookmark-navigator.component.html',
  styleUrl: './bookmark-navigator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent {
  @Input({ required: true })
  bookmarkNavElements!: BookmarkNavElement[];

  hiddenNavMenu: boolean = true;

  constructor() {}

  toggleNavMenu() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
  }
}
