import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractDialogComponent,
  SubmitDialog,
  submitDialogType,
} from '../abstract/abstract-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-change-password-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule],
  templateUrl: './change-password-confirmation-dialog.component.html',
  styleUrl: './change-password-confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordConfirmationDialogComponent
  extends AbstractDialogComponent
  implements OnInit
{
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
  styleUrl: './change-password-confirmation-dialog.component.css',
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

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
