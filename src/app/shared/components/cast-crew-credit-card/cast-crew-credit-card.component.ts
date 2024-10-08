import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IMG_SIZES } from '../../../providers';
import { AbstractPersonCardComponent } from '../../abstract/components/abstract-person-card.component';
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-cast-crew-credit-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    BookmarkSelectorComponent,
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
  protected readonly TMDB_PROFILE_132W_132H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_132W_132H_IMG_URL
  );

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
}
