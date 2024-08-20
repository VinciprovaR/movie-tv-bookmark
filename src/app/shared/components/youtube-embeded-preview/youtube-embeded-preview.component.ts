import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ImgComponent } from '../img/img.component';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeEmbededComponent } from '../youtube-embeded/youtube-embeded.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-youtube-embeded-preview',
  standalone: true,
  imports: [ImgComponent, YoutubeEmbededComponent],
  templateUrl: './youtube-embeded-preview.component.html',
  styleUrl: './youtube-embeded-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbededPreviewComponent implements OnInit {
  readonly domSanitizer = inject(DomSanitizer);
  readonly dialog = inject(MatDialog);

  onResize$!: Observable<Event>;

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

  constructor() {}
  ngOnInit(): void {
    this.buildThumbnail();
  }

  buildThumbnail() {
    this.urlThumbnail = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
    //  this.urlThumbnail = `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
  }

  openDialog() {
    this.openDialogEmitter.emit({
      videoId: this.videoId,
      videoName: this.videoName,
    });
  }
}
