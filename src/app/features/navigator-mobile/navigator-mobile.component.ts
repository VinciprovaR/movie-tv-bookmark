import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigator-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-mobile.component.html',
  styleUrl: './navigator-mobile.component.css',
})
export class NavigatorMobileComponent implements OnInit {
  @Input({ required: true })
  navElements!: NavElements;
  @Input({ required: true })
  hiddenNavMenu: boolean = true;
  @Output()
  toggleNavMenuMobile = new EventEmitter<null>();

  constructor() {}
  ngOnInit(): void {}

  onClickLink() {
    this.toggleNavMenuMobile.emit(null);
  }
}
