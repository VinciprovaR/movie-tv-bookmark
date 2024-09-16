import { Directive, ElementRef, ViewChild } from '@angular/core';
import { takeUntil, timer } from 'rxjs';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractAuthComponent extends AbstractComponent {
  @ViewChild('errorContainer')
  errorContainer!: ElementRef;

  isFormValid: boolean = true;

  constructor() {
    super();
  }

  abstract buildForm(): void;

  errorContainerTransition() {
    this.renderer.addClass(this.errorContainer.nativeElement, 'scale-110');
    this.renderer.addClass(this.errorContainer.nativeElement, 'shadow-lg');
    this.renderer.addClass(this.errorContainer.nativeElement, 'rounded-md');

    let subscription = timer(250)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.renderer.removeClass(
            this.errorContainer.nativeElement,
            'scale-110'
          );
          this.renderer.removeClass(
            this.errorContainer.nativeElement,
            'shadow-lg'
          );
          this.renderer.removeClass(
            this.errorContainer.nativeElement,
            'rounded-md'
          );
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }
}
