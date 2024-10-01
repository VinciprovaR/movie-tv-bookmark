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
import { debounceTime, fromEvent, Observable, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[FadeScroller]',
  standalone: true,
})
export class FadeScrollerDirective implements AfterViewInit {
  private readonly el: ElementRef<HTMLDivElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  @HostBinding('class')
  elementClass = 'should_fade ';
  destroyed$ = new Subject();
  onScroll$!: Observable<Event>;
  private readonly offSetPercentPixel: number = 40;

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

    if (spaceRemaining <= this.offSetPercentPixel) {
      this.renderer.addClass(this.el.nativeElement, 'is_hidden');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is_hidden');
    }
  }
}
