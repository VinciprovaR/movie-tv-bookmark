// import { Directive, EventEmitter, Output } from '@angular/core';
// import { AbstractComponent } from './abstract-component.component';
// import { submitDialog } from './abstract-dialog.component';

// @Directive()
// export abstract class AbstractDialogContentComponent extends AbstractComponent {
//   @Output()
//   closeOverlayEmitter = new EventEmitter<null>();
//   @Output()
//   submitDialogEmitter = new EventEmitter<submitDialog>();

//   constructor() {
//     super();
//   }

//   closeOverlay() {
//     this.closeOverlayEmitter.emit(null);
//   }

//   confirm() {
//     this.submitDialog('confirm');
//   }

//   cancel() {
//     this.submitDialog('cancel');
//   }

//   private submitDialog(submit: submitDialog) {
//     this.submitDialogEmitter.emit(submit);
//   }
// }
