import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AbstractComponent } from '../../components/abstract/abstract-component.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent extends AbstractComponent {
  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
