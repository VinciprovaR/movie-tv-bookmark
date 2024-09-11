import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  Videos,
  Video,
  MediaType,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ImgComponent } from '../img/img.component';
import { ArrowSliderComponent } from '../arrow-slider/arrow-slider.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { SwiperContainer } from 'swiper/element';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

import { AbstractComponent } from '../abstract/abstract-component.component';
import { YoutubeEmbededDialogComponent } from '../youtube-embeded-dialog/youtube-embeded-dialog.component';

@Component({
  selector: 'app-videos-container',
  standalone: true,
  imports: [
    YoutubeEmbededDialogComponent,
    CommonModule,
    MatIcon,
    ImgComponent,
    ArrowSliderComponent,
    MissingFieldPlaceholderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './videos-container.component.html',
  styleUrl: './videos-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosContainerComponent
  extends AbstractComponent
  implements OnInit
{
  //Injections

  readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);

  //Input-Output-Binding
  @ViewChild('swiper', { static: false })
  swiperRef!: ElementRef<SwiperContainer>;
  @Input({ required: true })
  title: string = '';
  @Input({ required: true })
  videos!: Videos;
  @Input({ required: true })
  videoTypeFilter!: { videosType: string[]; typeFilter: 'include' | 'exlude' };
  @Input({ required: true })
  mediaType!: MediaType;
  placeholder: string = '';
  //Others members
  private window!: Window;
  videoList: Video[] = [];

  isEnd: boolean = true;
  isBeginning: boolean = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.placeholder = `No ${this.title.toLowerCase()} found for this ${
      this.mediaType
    }`;
    this.window = window;
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.videoList = this.filterVideosType();
  }

  onSwiperSlidesUpdated(event: any) {
    this.checkSlideButtonDisplay(
      !!event.target.swiper?.isEnd,
      !!event.target.swiper?.isBeginning
    );
  }

  onSwiperslideNextTransitionEnd(event: any) {
    this.checkSlideButtonDisplay(
      !!event.target.swiper?.isEnd,
      !!event.target.swiper?.isBeginning
    );
  }
  onSwiperslidePrevTransitionEnd(event: any) {
    this.checkSlideButtonDisplay(
      !!event.target.swiper?.isEnd,
      !!event.target.swiper?.isBeginning
    );
  }

  nextVideo() {
    if (this.window.innerWidth > 1280) {
      this.swiperRef.nativeElement.swiper.slideNext();
      this.swiperRef.nativeElement.swiper.slideNext();
    } else {
      this.swiperRef.nativeElement.swiper.slideNext();
    }
  }
  prevVideo() {
    if (this.window.innerWidth > 1280) {
      this.swiperRef.nativeElement.swiper.slidePrev();
      this.swiperRef.nativeElement.swiper.slidePrev();
    } else {
      this.swiperRef.nativeElement.swiper.slidePrev();
    }
  }

  // openDialog(videoMetadata: { videoId: string; videoName: string }) {
  //   const dialogRef = this.dialog.open(YoutubeEmbededComponent, {
  //     data: {
  //       videoId: videoMetadata.videoId,
  //       videoName: videoMetadata.videoName,
  //     },
  //     scrollStrategy: this.overlay.scrollStrategies.noop(),
  //   });
  //   this.renderer.addClass(this.window.document.body, '');
  //   this.handleCloseDialog(dialogRef);
  // }

  private filterVideosType(): Video[] {
    if (this.videoTypeFilter.videosType.length > 0) {
      return this.videos.results.filter((video: Video) => {
        if (this.videoTypeFilter.typeFilter === 'include') {
          return (
            this.videoTypeFilter.videosType.indexOf(video.type.toLowerCase()) !=
            -1
          );
        }
        return !(
          this.videoTypeFilter.videosType.indexOf(video.type.toLowerCase()) !=
          -1
        );
      });
    }
    return this.videos.results;
  }

  private checkSlideButtonDisplay(isEnd: boolean, isBeginning: boolean) {
    this.isBeginning = isBeginning;
    this.isEnd = isEnd;
  }

  // private handleCloseDialog(
  //   dialogRef: MatDialogRef<YoutubeEmbededComponent, any>
  // ) {
  //   dialogRef.componentInstance.closeDialogObs$
  //     .pipe(takeUntil(this.destroyed$))
  //     .subscribe(() => {
  //       dialogRef.close();
  //     });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.destroyed$))
  //     .subscribe((result) => {
  //       `Dialog result: ${result}`;
  //       this.renderer.removeClass(
  //         this.window.document.body,
  //         'cdk-global-scrollblock-custom'
  //       );
  //     });
  // }
}
