import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-biography',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent, MatIconModule],
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

  toggleReadMoreText: string = 'Read More';
  chevron: string = 'expand_more';

  constructor() {
    super();
  }

  splitByDoubleNewline(text: string): string[] {
    return text.split('\n\n');
  }

  toggleReadMore() {
    if (this.textContainer.nativeElement.classList.contains('max-h-20')) {
      this.renderer.addClass(this.toggleButton.nativeElement, 'hidden');
      this.renderer.removeClass(this.textContainer.nativeElement, 'max-h-20');
      this.renderer.removeClass(
        this.textContainer.nativeElement,
        'overflow-hidden'
      );
    } else {
      this.renderer.addClass(this.textContainer.nativeElement, 'max-h-20');
      this.renderer.addClass(
        this.textContainer.nativeElement,
        'overflow-hidden'
      );
      this.toggleReadMoreText = 'Read More';
      this.chevron = 'expand_more';
    }
  }
}
