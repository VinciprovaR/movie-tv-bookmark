import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MediaType } from '../../models/media.models';
import { Subject } from 'rxjs';
import { Movie, TV } from '../../models';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { CardItemComponent } from '../card-item/card-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [
    RouterModule,
    LifecycleSelectorComponent,
    CardItemComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.css',
})
export class MediaItemComponent implements OnInit {
  @Input({ required: true })
  media!: Movie | TV;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  mediaTitleOrName!: string;

  moviePath: string = '/movie-detail';
  tvPath: string = '/tv-detail';
  detailMediaPath: string = '';

  card1xImgUrl: string = '';
  card2xImgUrl: string = '';
  card1or2xImgUrl: string = '';
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/movie-poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/movie-poster-not-found-test.png';

  constructor(
    private router: Router,
    @Inject(TMDB_CARD_1X_IMG_URL) private TMDB_CARD_1X_IMG_URL: string,
    @Inject(TMDB_CARD_2X_IMG_URL) private TMDB_CARD_2X_IMG_URL: string
  ) {}
  ngOnInit(): void {
    this.card1or2xImgUrl = this.media.poster_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.media.poster_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.media.poster_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;

    // this.card1xImgUrl = this.media.poster_path
    //   ? `${this.TMDB_CARD_1X_IMG_URL}${this.media.poster_path}`
    //   : '../../../../assets/images/movie-poster-not-found-test.png';

    // this.card2xImgUrl = this.media.poster_path
    //   ? `${this.TMDB_CARD_2X_IMG_URL}${this.media.poster_path}`
    //   : '../../../../assets/images/movie-poster-not-found-test.png';

    if (this.isMovieEntity(this.media)) {
      this.mediaTitleOrName = this.media.title;
    } else {
      this.mediaTitleOrName = this.media.name;
    }

    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${this.media.id}`
    );
  }

  isMovieEntity(movie: object): movie is Movie {
    return (movie as Movie).title !== undefined;
  }

  goToDetail() {
    //this.router.navigate([`/movie-detail/${this.idMedia}`]);
  }
}
