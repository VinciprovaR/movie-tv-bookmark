import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  private readonly el = inject(ElementRef);

  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();
  @Input() threshold = 100;
  @Input() thresholdScrollSelf = 50;
  @Input() scrollIsLoading: boolean = false;
  @Input()
  scrollSelf: boolean = false;
  @Input({ required: true })
  includeScrollEvents: boolean = true;

  private window!: Window;

  constructor() {}

  ngOnInit(): void {
    this.window = window;
  }

  @HostListener(`window:scroll`, ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    if (!this.scrollSelf) {
      if (!this.scrollIsLoading) {
        const heightOfWholePage =
          this.window.document.documentElement.scrollHeight;
        const heightOfElement = this.el.nativeElement.scrollHeight;
        const currentScrolledY = this.window.scrollY;

        const innerHeight = this.window.innerHeight;

        const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

        const scrollToBottom =
          heightOfElement -
          innerHeight -
          currentScrolledY +
          spaceOfElementAndPage;

        if (scrollToBottom < this.threshold) {
          this.nearEnd.emit();
        }
      }
    }
  }

  @HostListener(`scroll`, ['$event.target'])
  elementScrollEvent(event: KeyboardEvent) {
    if (this.scrollSelf) {
      if (!this.scrollIsLoading) {
        const currentScrolledY = this.el.nativeElement.scrollTop;

        const scrollTopMax = this.el.nativeElement.scrollTopMax;

        if (currentScrolledY >= scrollTopMax - this.thresholdScrollSelf) {
          this.nearEnd.emit();
        }
      }
    }
  }
}
