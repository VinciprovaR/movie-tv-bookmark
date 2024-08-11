import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { YouTubePlayer } from '@angular/youtube-player';
import { Subject, Observable, fromEvent, takeUntil, debounceTime } from 'rxjs';

@Component({
  selector: 'app-youtube-embeded',
  standalone: true,
  imports: [CommonModule, ImgComponent, MatDialogModule, YouTubePlayer],
  templateUrl: './youtube-embeded.component.html',
  styleUrl: './youtube-embeded.component.css',
})
export class YoutubeEmbededComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly data = inject(MAT_DIALOG_DATA);

  @ViewChild('youTubePlayer') youTubePlayer!: ElementRef<HTMLDivElement>;
  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  destroyed$ = new Subject();
  onResize$!: Observable<Event>;

  playerVars: YT.PlayerVars = { autohide: 0 };
  videoHeight: number | undefined;
  videoWidth: number | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.videoId = this.data.videoId;
    this.videoName = this.data.videoName;
  }
}
