import { CommonModule } from '@angular/common';
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
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-cast-crew-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    ImgComponent,
  ],
  templateUrl: './cast-crew-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastCrewCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  protected readonly TMDB_PROFILE_W_185_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_W_185_IMG_URL
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
