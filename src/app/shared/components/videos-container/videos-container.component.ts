import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { YoutubeEmbededPreviewComponent } from '../youtube-embeded-preview/youtube-embeded-preview.component';
import { Videos, Video } from '../../interfaces/TMDB/tmdb-media.interface';
// import Swiper from 'swiper';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ImgComponent } from '../img/img.component';
import { ArrowSliderComponent } from '../arrow-slider/arrow-slider.component';

@Component({
  selector: 'app-videos-container',
  standalone: true,
  imports: [
    YoutubeEmbededPreviewComponent,
    CommonModule,
    MatIcon,
    ImgComponent,
    ArrowSliderComponent,
  ],
  templateUrl: './videos-container.component.html',
  styleUrl: './videos-container.component.css',
})
export class VideosContainerComponent implements OnInit, AfterViewInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ required: true })
  videos!: Videos;
  @Input({ required: true })
  videoType: string = '';

  videoList: Video[] = [];
  swiper!: Swiper;
  isEnd: boolean = true;
  isBeginning: boolean = true;

  constructor() {}
  ngAfterViewInit(): void {
    this.initSlider();
    this.checkSlideButtonDisplay();
    this.initEvents();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.videoList = this.filterVideosType();
  }

  initSlider() {
    this.swiper = new Swiper('.swiper', {
      // Optional parameters
      direction: 'horizontal',
      loop: false,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.button-next-custom',
        prevEl: '.button-prev-custom',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  initEvents() {
    this.swiper.on('slideNextTransitionEnd', () => {
      this.checkSlideButtonDisplay();
    });

    this.swiper.on('slidePrevTransitionEnd', () => {
      this.checkSlideButtonDisplay();
    });
  }

  filterVideosType(): Video[] {
    return this.videos.results.filter((video: Video) => {
      return video.type.toLowerCase() === this.videoType;
    });
  }

  nextVideo() {
    this.swiper.slideNext();
  }
  prevVideo() {
    this.swiper.slidePrev();
  }

  checkSlideButtonDisplay() {
    this.isBeginning = this.swiper.isBeginning;
    this.isEnd = this.swiper.isEnd;
  }
}
