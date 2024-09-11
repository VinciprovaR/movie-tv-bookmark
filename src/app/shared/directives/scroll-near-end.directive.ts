import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  NgZone,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  private readonly zone = inject(NgZone);
  private readonly el = inject(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();
  @Input() threshold = 100;
  @Input() thresholdScrollSelf = 50;
  @Input() scrollIsLoading: boolean = false;
  @Input()
  scrollSelf: boolean = false;
  @Input({ required: true })
  includeScrollEvents: boolean = true;

  private window!: Window;

  ngOnInit(): void {
    this.window = window;
  }

  windowScrollEvent() {
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
