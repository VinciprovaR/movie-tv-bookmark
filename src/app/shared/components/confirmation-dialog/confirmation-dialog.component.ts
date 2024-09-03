import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogContentComponent } from '../confirmation-dialog-content/confirmation-dialog-content.component';

export type confirm = 'confirm';
export type cancel = 'cancel';
export type submitOverlay = confirm | cancel;

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule, ConfirmationDialogContentComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent
  extends AbstractComponent
  implements OnInit
{
  protected readonly overlay = inject(Overlay);

  @Input({ required: true })
  buttonLabel!: string;
  @Input({ required: true })
  message!: string;
  @Input({ required: true })
  title!: string;

  @ViewChild('trigger') trigger!: ElementRef;
  @Output()
  submitConfirmationEmitter = new EventEmitter<confirm>();

  isOpen: boolean = false;
  private overlayRef!: OverlayRef | null;
  private attachSubscription!: Subscription;
  private detachSubscription!: Subscription;
  private backdropClickSubscription!: Subscription;

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.initSubscriptions();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {
    this.pageEventService.resizeEvent$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.onWindowResize();
      });
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
      const positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(this.trigger)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 8, // Adjust the offset as needed
          },
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
      });

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
    }
  }

  initContent() {
    if (this.overlayRef) {
      const portal = new ComponentPortal(ConfirmationDialogContentComponent);

      const intance = this.overlayRef.attach(portal);

      intance.instance.message = this.message;
      intance.instance.title = this.title;

      intance.instance.submitOverlayEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: submitOverlay) => {
          this.closeOverlay();
          if (submit === 'confirm') {
            this.submitConfirmationEmitter.emit(submit);
          }
        });

      intance.instance.closeOverlayEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.closeOverlay();
        });
    }
  }

  closeOverlay() {
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
      console.log('Window resized');
      this.overlayRef.updatePosition(); //
    }
  }
}
