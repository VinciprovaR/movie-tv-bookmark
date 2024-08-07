import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-static-tag',
  standalone: true,
  imports: [],
  templateUrl: './static-tag.component.html',
  styleUrl: './static-tag.component.css',
})
export class StaticTagComponent {
  @Input({ required: true })
  genreName: string = '';
}
