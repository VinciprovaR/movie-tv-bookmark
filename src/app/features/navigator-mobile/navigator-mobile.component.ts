import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractNavComponent } from '../../shared/components/abstract/abstract-nav.component';

@Component({
  selector: 'app-navigator-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-mobile.component.html',
  styleUrl: './navigator-mobile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorMobileComponent
  extends AbstractNavComponent
  implements OnInit
{
  @Input({ required: true })
  navElements!: NavElements;
  @Input({ required: true })
  hiddenNavMenu: boolean = true;
  @Output()
  toggleNavMenuMobile = new EventEmitter<null>();

  constructor() {
    super();
  }
  ngOnInit(): void {}

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  onClickLink() {
    this.toggleNavMenuMobile.emit(null);
  }
}
