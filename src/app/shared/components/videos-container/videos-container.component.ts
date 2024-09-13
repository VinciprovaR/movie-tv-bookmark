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

  placeholderNotFound: string = '';
  titleNotFound: string = '';
  //Others members
  private window!: Window;
  videoList: Video[] = [];

  isEnd: boolean = true;
  isBeginning: boolean = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.placeholderNotFound = ` We couldn't find any ${this.title.toLowerCase()} for this ${
      this.mediaType
    }`;
    this.window = window;
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.videoList = this.filterVideosType();
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

  private filterVideosType(): Video[] {
    if (this.videoTypeFilter.videosType.length > 0) {
      return this.videos.results.filter((video: Video) => {
        if (this.videoTypeFilter.typeFilter === 'include') {
          return (
            this.videoTypeFilter.videosType.indexOf(video.type.toLowerCase()) !=
            -1
          );
        }
        return (
          this.videoTypeFilter.videosType.indexOf(video.type.toLowerCase()) ==
          -1
        );
      });
    }
    return this.videos.results;
  }

  checkSlideButtonDisplay(event: any) {
    this.isBeginning = !!event.target.swiper?.isBeginning;
    this.isEnd = !!event.target.swiper?.isEnd;
  }
}
