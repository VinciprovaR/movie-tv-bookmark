import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { YoutubeEmbededPreviewComponent } from '../youtube-embeded-preview/youtube-embeded-preview.component';
import {
  Videos,
  Video,
  MediaType,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ImgComponent } from '../img/img.component';
import { ArrowSliderComponent } from '../arrow-slider/arrow-slider.component';
import { PageEventService } from '../../services/page-event.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { YoutubeEmbededComponent } from '../youtube-embeded/youtube-embeded.component';
import { Overlay } from '@angular/cdk/overlay';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-videos-container',
  standalone: true,
  imports: [
    YoutubeEmbededPreviewComponent,
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
export class VideosContainerComponent implements OnInit {
  //Injections
  readonly pageEventService = inject(PageEventService);
  readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);

  //Observable
  destroyed$ = new Subject();

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
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
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

  openDialog(videoMetadata: { videoId: string; videoName: string }) {
    const dialogRef = this.dialog.open(YoutubeEmbededComponent, {
      data: {
        videoId: videoMetadata.videoId,
        videoName: videoMetadata.videoName,
      },
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    this.renderer.addClass(
      this.window.document.body,
      'cdk-global-scrollblock-custom'
    );
    this.handleCloseDialog(dialogRef);
  }

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

  private handleCloseDialog(
    dialogRef: MatDialogRef<YoutubeEmbededComponent, any>
  ) {
    dialogRef.componentInstance.closeDialogObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        dialogRef.close();
      });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        // console.log(`Dialog result: ${result}`);
        this.renderer.removeClass(
          this.window.document.body,
          'cdk-global-scrollblock-custom'
        );
      });
  }
}
