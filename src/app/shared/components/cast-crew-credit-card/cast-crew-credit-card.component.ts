import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractPersonCardComponent } from '../abstract/abstract-person-card.component';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-cast-crew-credit-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
    ImgComponent,
  ],
  templateUrl: './cast-crew-credit-card.component.html',
  styleUrl: './cast-crew-credit-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastCrewCreditCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  @Input({ required: true })
  id: number = 0;
  @Input({ required: true })
  profile_path: string = '';
  @Input({ required: true })
  name: string = '';
  @Input({ required: true })
  role: string = '';

  override ngOnInit(): void {
    this.buildDetailPath(this.id);
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
