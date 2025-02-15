import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';

@Component({
  selector: 'app-bookmark-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './bookmark-navigator.component.html',
})
export class BookmarkNavigatorComponent extends AbstractComponent {
  @Input({ required: true })
  bookmarkNavElements!: BookmarkNavElement[];

  hiddenNavMenu: boolean = true;

  constructor() {
    super();
  }

  toggleNavMenu() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
  }
}
