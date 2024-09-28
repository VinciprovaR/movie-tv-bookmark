import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { takeUntil } from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { AbstractDialogComponent } from '../../abstract/components/abstract-dialog.component';
import {
  SubmitDialog,
  submitDialogType,
} from '../../interfaces/layout.interface';

@Component({
  selector: 'app-change-password-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule],
  templateUrl: './change-password-confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordConfirmationDialogComponent extends AbstractDialogComponent {
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
      const portal = new ComponentPortal(ChangePasswordDialogContentComponent);

      const intance = this.overlayRef.attach(portal);

      intance.instance.submitDialogContentEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: SubmitDialog) => {
          this.closeOverlay();
          if (submit.typeSubmit === 'confirm') {
            this.submitDialogEmitter.emit(submit);
          }
        });
    }
  }
}

@Component({
  selector: 'app-confirmation-dialog-content',
  standalone: true,
  imports: [MatIconModule, OverlayModule, MatDivider],
  templateUrl: './change-password-dialog-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogContentComponent extends AbstractComponent {
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  constructor() {
    super();
  }

  confirm() {
    this.submitDialog('confirm');
  }

  cancel() {
    this.submitDialog('cancel');
  }

  private submitDialog(submit: submitDialogType) {
    this.submitDialogContentEmitter.emit({ typeSubmit: submit });
  }
}
