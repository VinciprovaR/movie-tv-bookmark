import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-item-detail',
  standalone: true,
  imports: [],
  templateUrl: './media-item-detail.component.html',
  styleUrl: './media-item-detail.component.css',
})
export class MediaItemDetailComponent {

  @Input()
  id: number = 0;

}
