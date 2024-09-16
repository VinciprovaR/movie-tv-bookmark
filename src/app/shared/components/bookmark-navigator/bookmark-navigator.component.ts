import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-bookmark-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './bookmark-navigator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent extends AbstractComponent {
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
