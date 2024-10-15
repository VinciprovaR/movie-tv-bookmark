import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  NgZone,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { PageEventService } from '../../../services/page-event.service';

@Directive()
export abstract class AbstractComponent {
  protected readonly destroyRef$ = inject(DestroyRef);
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly zone = inject(NgZone);
  protected readonly store = inject(Store);
  protected renderer!: Renderer2;
  protected readonly rendererFactory = inject(RendererFactory2);
  protected readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly pageEventService = inject(PageEventService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  destroyed$ = new Subject();

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  scroll(
    elSm: HTMLElement,
    elXl: HTMLElement,
    offSetXl: number = 80,
    offSetSm: number = 80
  ) {
    if (window.innerWidth <= 1024) {
      const y = elSm.getBoundingClientRect().top + window.scrollY - offSetSm;

      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      const y = elXl.getBoundingClientRect().top + window.scrollY - offSetXl;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }
}
