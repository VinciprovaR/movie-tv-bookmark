import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold = 100;
  @Input() scrollIsLoading: boolean = false;

  private window!: Window;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // save window object for type safety
    this.window = window;
  }

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    if (!this.scrollIsLoading) {
      // height of whole window page
      const heightOfWholePage =
        this.window.document.documentElement.scrollHeight;

      // how big in pixels the element is
      const heightOfElement = this.el.nativeElement.scrollHeight;

      // currently scrolled Y position
      const currentScrolledY = this.window.scrollY;

      // height of opened window - shrinks if console is opened
      const innerHeight = this.window.innerHeight;

      /**
       * the area between the start of the page and when this element is visible
       * in the parent component
       */
      const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

      // calculated whether we are near the end
      const scrollToBottom =
        heightOfElement -
        innerHeight -
        currentScrolledY +
        spaceOfElementAndPage;

      // if the user is near end
      if (scrollToBottom < this.threshold) {
        this.nearEnd.emit();
      }
    }
  }
}
