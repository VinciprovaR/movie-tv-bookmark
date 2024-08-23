import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-biography',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent],
  templateUrl: './biography.component.html',
  styleUrl: './biography.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiographyComponent extends AbstractComponent {
  @ViewChild('textContainer')
  textContainer!: ElementRef;

  @ViewChild('toggleButton')
  toggleButton!: ElementRef;

  @Input({ required: true })
  biography!: string;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  splitByDoubleNewline(text: string): string[] {
    return text.split('\n\n');
  }

  toggleReadMore() {
    if (this.textContainer.nativeElement.classList.contains('max-h-20')) {
      this.renderer.removeClass(this.textContainer.nativeElement, 'max-h-20');
      this.renderer.removeClass(
        this.textContainer.nativeElement,
        'overflow-hidden'
      );

      this.toggleButton.nativeElement.textContent = 'Show Less';
    } else {
      this.renderer.addClass(this.textContainer.nativeElement, 'max-h-20');
      this.renderer.addClass(
        this.textContainer.nativeElement,
        'overflow-hidden'
      );
      this.toggleButton.nativeElement.textContent = 'Read More';
    }
  }
}
