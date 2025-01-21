import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { AbstractDialogComponent } from '../../abstract/components/abstract-dialog.component';
import {
  scrollDirection,
  SubmitDialog,
  submitDialogType,
} from '../../interfaces/layout.interface';

@Component({
  selector: 'app-bookmark-disabled-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule, CommonModule],
  templateUrl: './bookmark-disabled-dialog.component.html',
})
export class BookmarkDisabledDialogComponent extends AbstractDialogComponent {
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @Input({ required: true })
  isDetail!: boolean;

  override positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
  ];

  constructor() {
    super();
    this.registerEffects();
  }

  registerEffects() {
    effect(() => {
      this.pageEventService.$windowInnerHeight();
      this.pageEventService.$windowInnerWidth();
      this.onWindowResize();
    });
  }

  override initContent() {
    if (this.overlayRef) {
      const portal = new ComponentPortal(
        BookmarkDisabledDialogContentComponent
      );

      const intance = this.overlayRef.attach(portal);

      intance.instance.submitDialogContentEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: SubmitDialog) => {
          this.closeOverlay();
        });
    }
  }
}

@Component({
  selector: 'app-bookmark-disabled-content',
  standalone: true,
  imports: [MatIconModule, OverlayModule, RouterLink],
  template: `<div class="p-4">
    <div class="p-4 bg-[var(--theme-color-1)] rounded-md">
      <div>
        To use the bookmark feature
        <a
          (keyup)="cancel()"
          (click)="cancel()"
          [routerLink]="'/login'"
          class="font-medium text-[var(--link-color)]"
        >
          Sign In</a
        >
        with your account, or
        <a
          (keyup)="cancel()"
          (click)="cancel()"
          [routerLink]="'/register'"
          class="font-medium text-[var(--link-color)]"
          >Sign Up</a
        >
      </div>
    </div>
  </div> `,
})
export class BookmarkDisabledDialogContentComponent extends AbstractComponent {
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  constructor() {
    super();
  }

  cancel() {
    this.submitDialog('cancel');
  }

  private submitDialog(submit: submitDialogType) {
    this.submitDialogContentEmitter.emit({ typeSubmit: submit });
  }
}
