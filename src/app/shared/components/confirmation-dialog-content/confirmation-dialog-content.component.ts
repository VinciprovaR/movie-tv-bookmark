import { OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { submitOverlay } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-confirmation-dialog-content',
  standalone: true,
  imports: [MatIconModule, OverlayModule, RouterLink],
  templateUrl: './confirmation-dialog-content.component.html',
  styleUrl: './confirmation-dialog-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogContentComponent extends AbstractComponent {
  @Output()
  closeOverlayEmitter = new EventEmitter<null>();
  @Output()
  submitOverlayEmitter = new EventEmitter<submitOverlay>();
  title!: string;
  message!: string;

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  closeOverlay() {
    this.closeOverlayEmitter.emit(null);
  }

  confirm() {
    this.submitOverlay('confirm');
  }

  cancel() {
    this.submitOverlay('cancel');
  }

  private submitOverlay(submit: submitOverlay) {
    this.submitOverlayEmitter.emit(submit);
  }
}
