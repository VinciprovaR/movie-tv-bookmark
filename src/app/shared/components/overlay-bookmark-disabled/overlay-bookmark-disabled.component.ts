import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, Portal, CdkPortalOutlet } from '@angular/cdk/portal';
import { Subscription, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { PageEventService } from '../../services/page-event.service';
import { RouterLink } from '@angular/router';
import { BookmarkDisabledContentComponent } from '../bookmark-disabled-content/bookmark-disabled-content.component';

@Component({
  selector: 'app-overlay-bookmark-disabled',
  standalone: true,
  imports: [MatIconModule, OverlayModule, BookmarkDisabledContentComponent],
  templateUrl: './overlay-bookmark-disabled.component.html',
  styleUrl: './overlay-bookmark-disabled.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayBookmarkDisabledComponent
  extends AbstractComponent
  implements OnInit
{
  protected readonly overlay = inject(Overlay);

  isOpen: boolean = false;
  private overlayRef!: OverlayRef | null;
  private attachSubscription!: Subscription;
  private detachSubscription!: Subscription;
  private backdropClickSubscription!: Subscription;
  @ViewChild('trigger') trigger!: ElementRef;
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

      const portal = new ComponentPortal(BookmarkDisabledContentComponent);

      const intance = this.overlayRef.attach(portal);

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
