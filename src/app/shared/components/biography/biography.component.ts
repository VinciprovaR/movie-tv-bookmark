import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-biography',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent, MatIconModule],
  templateUrl: './biography.component.html',
  styleUrl: './biography.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiographyComponent extends AbstractComponent implements OnInit {
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
  ngOnInit(): void {
    console.log(this.biography);
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
