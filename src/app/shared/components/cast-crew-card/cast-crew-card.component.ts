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
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';
import { ImgComponent } from '../img/img.component';
import { AbstractPersonCardComponent } from '../../abstract/components/abstract-person-card.component';

@Component({
  selector: 'app-cast-crew-card',
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
  templateUrl: './cast-crew-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastCrewCardComponent
  extends AbstractPersonCardComponent
  implements OnInit
{
  protected readonly TMDB_PROFILE_138W_175H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_138W_175H_IMG_URL
  );
  protected readonly TMDB_PROFILE_276W_350H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_276W_350H_IMG_URL
  );
  protected readonly TMDB_W_300_IMG_URL = inject(IMG_SIZES.TMDB_W_300_IMG_URL);
  protected readonly TMDB_W_400_IMG_URL = inject(IMG_SIZES.TMDB_W_400_IMG_URL);

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
