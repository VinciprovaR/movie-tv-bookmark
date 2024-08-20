import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  Event,
} from '@angular/router';
import { filter, map, Observable, Subject, takeUntil, timer } from 'rxjs';

import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-navigator-desktop',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-desktop.component.html',
  styleUrl: './navigator-desktop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorDesktopComponent
  extends AbstractComponent
  implements OnInit
{
  urlAfterRedirects!: string;

  @ViewChild('submenu')
  submenu!: ElementRef;
  @ViewChild('menuEl')
  menuEl!: ElementRef;

  @Input({ required: true })
  navElements!: NavElements;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initSubscriptions();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {
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

  hideSubMenu() {
    this.renderer.removeClass(this.menuEl.nativeElement, 'show-sub-menu');
    timer(500)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.renderer.addClass(this.menuEl.nativeElement, 'show-sub-menu');
      });
  }

  checkIsActive(navElementKey: string) {
    if (this.urlAfterRedirects) {
      return this.urlAfterRedirects.indexOf(navElementKey) != -1;
    }

    return false;
  }
}
