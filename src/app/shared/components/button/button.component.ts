// import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// import { AbstractComponent } from '../abstract/abstract-component.component';

// @Component({
//   selector: 'app-button',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './button.component.html',
//   styleUrl: './button.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ButtonComponent extends AbstractComponent {
//   @Input({ required: true })
//   label!: string;

//   @Input({ required: true })
//   role: 'normal' | 'warning' | 'danger' = 'normal';

//   @Input({ required: true })
//   type: 'button' | 'menu' | 'reset' | 'submit' = 'button';

//   constructor() {
//     super();
//   }

//   override initSelectors(): void {}
//   override initSubscriptions(): void {}
// }
