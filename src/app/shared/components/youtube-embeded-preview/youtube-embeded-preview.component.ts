import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ImgComponent } from '../img/img.component';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeEmbededComponent } from '../youtube-embeded/youtube-embeded.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-youtube-embeded-preview',
  standalone: true,
  imports: [ImgComponent, YoutubeEmbededComponent, CommonModule],
  templateUrl: './youtube-embeded-preview.component.html',
  styleUrl: './youtube-embeded-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbededPreviewComponent
  extends AbstractComponent
  implements OnInit
{
  readonly domSanitizer = inject(DomSanitizer);
  readonly dialog = inject(MatDialog);

  onResize$!: Observable<Event>;

  @ViewChild('thumbnail')
  thumbnail!: ElementRef;

  @Output()
  openDialogEmitter = new EventEmitter<{
    videoId: string;
    videoName: string;
  }>();

  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  urlThumbnail: string = '';

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.getYouTubeThumbnail();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  getYouTubeThumbnail() {
    const img = new Image();
    img.src = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
    img.onload = () => {
      if (img.width > 120) {
        // Check if the image is a valid thumbnail
        this.renderer.setStyle(
          this.thumbnail.nativeElement,
          'background-image',
          `url(https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg)`
        );
      } else {
        this.renderer.setStyle(
          this.thumbnail.nativeElement,
          'background-image',
          `url(https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg)`
        );
      }
    };
  }

  openDialog() {
    this.openDialogEmitter.emit({
      videoId: this.videoId,
      videoName: this.videoName,
    });
  }
}
