import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-static-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './static-tag.component.html',
  styleUrl: './static-tag.component.css',
})
export class StaticTagComponent {
  @Input({ required: true })
  tag: string = '';
  @Input()
  type: 'square' | 'ellipse' | 'rounded-edge' = 'square';
}
