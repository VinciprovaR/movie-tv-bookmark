import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { Subject, Observable, fromEvent, takeUntil, debounceTime } from 'rxjs';
import { ImgComponent } from '../img/img.component';
@Component({
  selector: 'app-youtube-embeded',
  standalone: true,
  imports: [YouTubePlayer, ImgComponent],
  templateUrl: './youtube-embeded.component.html',
  styleUrl: './youtube-embeded.component.css',
})
export class YoutubeEmbededComponent implements OnInit, AfterViewInit {
  readonly domSanitizer = inject(DomSanitizer);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  destroyed$ = new Subject();
  onResize$!: Observable<Event>;

  @ViewChild('youTubePlayer') youTubePlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('player') player!: YouTubePlayer;
  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  videoHeight: number | undefined;
  videoWidth: number | undefined;

  urlVideo: string = 'https://www.youtube-nocookie.com/embed/';
  urlThumbnail: string = '';
  playerVars: YT.PlayerVars = { autohide: 0 };

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  ngOnInit(): void {
    this.urlThumbnail = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;

    this.initSelectors();
  }

  ngAfterViewInit(): void {
    //const s = new Date().getTime();

    //to-do remove workaround
    setTimeout(() => {
      // console.log('wait ', new Date().getTime() - s);
      this.onResize();
    }, 0);
    //this.onResize();
  }

  initSelectors() {
    this.onResize$ = fromEvent(window, 'resize').pipe(
      takeUntil(this.destroyed$),
      debounceTime(50)
    );

    this.onResize$.subscribe(() => {
      this.onResize();
    });
  }

  onResize(): void {
    // this.videoWidth = Math.min(
    //   this.youTubePlayer.nativeElement.clientWidth,
    //   800
    // );
    this.videoWidth = this.youTubePlayer.nativeElement.clientWidth;
    this.videoHeight = this.videoWidth * 0.61; //this.videoWidth * 0.564;

    this.changeDetectorRef.detectChanges();
  }
}
