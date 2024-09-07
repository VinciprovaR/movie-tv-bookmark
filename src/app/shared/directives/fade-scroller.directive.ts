import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  NgZone,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Subject, Observable, fromEvent, takeUntil, debounceTime } from 'rxjs';
/*
.should_fade:after {
  transition: linear 0.3s;
  opacity: 1;
  width: 70px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0,
    var(--theme-color-1) 100%
  );
}
.is_hidden:after {
  transition: linear 0.3s;
  opacity: 0;
}

.should_fade:after {
  content: "";
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  will-change: opacity;
  pointer-events: none;
}


*/
@Directive({
  selector: '[FadeScroller]',
  standalone: true,
})
export class FadeScrollerDirective implements AfterViewInit {
  private readonly el: ElementRef<HTMLDivElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);

  destroyed$ = new Subject();
  onScroll$!: Observable<Event>;

  @HostBinding('class')
  elementClass = 'should_fade ';

  @Input()
  private offSetPercentage: number = 6;
  @Input()
  private offSetPercenPixel: number = 40;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.renderer = this.rendererFactory.createRenderer(null, null);
      this.initSelectors();
    });
  }

  initSelectors() {
    this.onScroll$ = fromEvent(this.el.nativeElement, 'scroll').pipe(
      takeUntil(this.destroyed$),
      debounceTime(50)
    );
    this.onScroll$.subscribe(() => {
      this.onScroll();
    });
  }

  onScroll() {
    const spaceRemaining =
      this.el.nativeElement.scrollWidth -
      this.el.nativeElement.clientWidth -
      this.el.nativeElement.scrollLeft;

    const offSetSpace =
      (this.el.nativeElement.scrollWidth / 100) * this.offSetPercentage;

    if (spaceRemaining <= this.offSetPercenPixel) {
      this.renderer.addClass(this.el.nativeElement, 'is_hidden');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is_hidden');
    }
  }
}
