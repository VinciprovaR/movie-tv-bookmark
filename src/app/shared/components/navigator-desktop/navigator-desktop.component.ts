import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, takeUntil, timer } from 'rxjs';
import { AbstractNavComponent } from '../../abstract/components/abstract-nav.component';
import { NavElements } from '../../interfaces/navigator.interface';

@Component({
  selector: 'app-navigator-desktop',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-desktop.component.html',
  styleUrl: './navigator-desktop.component.css',
})
export class NavigatorDesktopComponent
  extends AbstractNavComponent
  implements OnInit
{
  urlAfterRedirects!: string;
  @ViewChild('submenu')
  submenu!: ElementRef;
  @Input({ required: true })
  navElements!: NavElements;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event: any) => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects)
      )
      .subscribe((urlAfterRedirects) => {
        this.urlAfterRedirects = urlAfterRedirects;
      });
  }

  hideSubMenu(menuEl: HTMLElement) {
    this.renderer.removeClass(menuEl, 'show-sub-menu');
    timer(500)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.renderer.addClass(menuEl, 'show-sub-menu');
      });
  }

  checkIsActive(paths: string[]) {
    if (this.urlAfterRedirects) {
      return paths.indexOf(this.urlAfterRedirects) != -1;
    }

    return false;
  }
}
