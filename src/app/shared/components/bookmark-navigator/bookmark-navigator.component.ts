import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-bookmark-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './bookmark-navigator.component.html',
  styleUrl: './bookmark-navigator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent extends AbstractComponent {
  @Input({ required: true })
  bookmarkNavElements!: BookmarkNavElement[];

  hiddenNavMenu: boolean = true;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  toggleNavMenu() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
  }
}
