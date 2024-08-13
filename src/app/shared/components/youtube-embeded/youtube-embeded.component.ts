import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { YouTubePlayer } from '@angular/youtube-player';
import { Subject, Observable, fromEvent, takeUntil, debounceTime } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-youtube-embeded',
  standalone: true,
  imports: [
    CommonModule,
    ImgComponent,
    MatDialogModule,
    YouTubePlayer,
    MatIconModule,
  ],
  templateUrl: './youtube-embeded.component.html',
  styleUrl: './youtube-embeded.component.css',
})
export class YoutubeEmbededComponent implements OnInit {
  readonly data = inject(MAT_DIALOG_DATA);

  private closeDialog$ = new Subject<null>();
  closeDialogObs$ = this.closeDialog$.asObservable();

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

  onCloseDialog() {
    this.closeDialog$.next(null);
    console.log('close');
  }
}
