import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Observable, takeUntil } from 'rxjs';
import { ImgComponent } from '../img/img.component';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeEmbededComponent } from '../youtube-embeded/youtube-embeded.component';

@Component({
  selector: 'app-youtube-embeded-preview',
  standalone: true,
  imports: [ImgComponent, YoutubeEmbededComponent],
  templateUrl: './youtube-embeded-preview.component.html',
  styleUrl: './youtube-embeded-preview.component.css',
})
export class YoutubeEmbededPreviewComponent implements OnInit {
  readonly domSanitizer = inject(DomSanitizer);

  readonly dialog = inject(MatDialog);

  destroyed$ = new Subject();
  onResize$!: Observable<Event>;

  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  urlThumbnail: string = '';

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  ngOnInit(): void {
    this.buildThumbnail();
  }

  buildThumbnail() {
    this.urlThumbnail = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
    //  this.urlThumbnail = `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
  }

  openDialog() {
    const dialogRef = this.dialog.open(YoutubeEmbededComponent, {
      data: { videoId: this.videoId, videoName: this.videoName },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }
}
