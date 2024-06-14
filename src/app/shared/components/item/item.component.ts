import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  @Input()
  itemTitle!: string;

  @Input()
  itemOverview!: string;

  @Input()
  itemType!: string;

  constructor() {}
}
