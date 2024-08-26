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

import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbededComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly data = inject(MAT_DIALOG_DATA);

  onResize$!: Observable<Event>;
  private closeDialog$ = new Subject<null>();
  closeDialogObs$ = this.closeDialog$.asObservable();

  @ViewChild('youTubePlayer') youTubePlayer!: ElementRef<HTMLDivElement>;
  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  playerVars: YT.PlayerVars = { autohide: 0 };
  videoHeight: number | undefined;
  videoWidth: number | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.videoId = this.data.videoId;
    this.videoName = this.data.videoName;
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  onCloseDialog() {
    this.closeDialog$.next(null);
  }
}
