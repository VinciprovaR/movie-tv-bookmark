import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { Subscription, takeUntil } from 'rxjs';

export type confirm = 'confirm';
export type cancel = 'cancel';
export type submitDialogType = confirm | cancel;
export type scrollStrategies = 'block' | 'close' | 'noop' | 'reposition';

export interface SubmitDialog {
  typeSubmit: submitDialogType;
  payload?: any;
}

@Directive()
export abstract class AbstractDialogComponent
  extends AbstractComponent
  implements OnDestroy
{
  protected readonly overlay = inject(Overlay);

  @ViewChild('trigger') trigger!: ElementRef;
  @Output()
  submitDialogEmitter = new EventEmitter<SubmitDialog>();

  isOpen: boolean = false;
  protected overlayRef!: OverlayRef | null;
  protected attachSubscription!: Subscription;
  protected detachSubscription!: Subscription;
  protected backdropClickSubscription!: Subscription;
  protected keydownEventSubscription!: Subscription;
  protected positions: ConnectedPosition[] = [];
  protected panelClass: string = '';
  protected backdropClass: string = '';
  protected window!: Window;
  protected scrollStrategiesTypeSelected!: scrollStrategies;

  constructor() {
    super();
    this.window = window;
  }

  toggleOverlay() {
    if (this.isOpen) {
      this.closeOverlay();
    } else {
      this.openOverlay();
      this.initContent();
    }
  }

  openOverlay() {
    this.isOpen = true;

    if (!this.overlayRef) {
      let positionStrategy;

      if (this.positions.length > 0) {
        positionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(this.trigger)
          .withPositions(this.positions);
      } else {
        positionStrategy = this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically();
      }

      let overlayConfig: OverlayConfig = {
        positionStrategy: positionStrategy,
        scrollStrategy: this.scrollStrategiesTypeSelected
          ? this.overlay.scrollStrategies[this.scrollStrategiesTypeSelected]()
          : this.overlay.scrollStrategies.close(),
        hasBackdrop: true,
      };

      if (this.backdropClass) {
        overlayConfig.backdropClass = this.backdropClass;
      }
      if (this.panelClass) {
        overlayConfig.panelClass = this.panelClass;
      }

      this.overlayRef = this.overlay.create(overlayConfig);

      this.detachSubscription = this.overlayRef
        .detachments()
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            this.closeOverlay();
          },
          complete: () => {
            this.detachSubscription.unsubscribe();
          },
        });

      this.backdropClickSubscription = this.overlayRef
        .backdropClick()
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            this.closeOverlay();
          },
          complete: () => {
            this.backdropClickSubscription.unsubscribe();
          },
        });

      this.keydownEventSubscription = this.overlayRef
        .keydownEvents()
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              this.closeOverlay();
            }
          },
          complete: () => {
            this.keydownEventSubscription.unsubscribe();
          },
        });
    }
  }

  abstract initContent(): void;

  closeOverlay() {
    this.renderer.removeStyle(this.window.document.body, 'overflow');
    this.isOpen = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;

      if (this.attachSubscription) {
        this.attachSubscription.unsubscribe();
      }
    }
  }

  onWindowResize() {
    if (this.overlayRef) {
      this.overlayRef.updatePosition(); //
    }
  }
  ngOnDestroy(): void {
    this.closeOverlay();
  }
}
