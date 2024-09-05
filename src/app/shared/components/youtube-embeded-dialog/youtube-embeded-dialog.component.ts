import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractDialogComponent,
  scrollStrategies,
  SubmitDialog,
  submitDialogType,
} from '../abstract/abstract-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { ImgComponent } from '../img/img.component';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-embeded-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule],
  templateUrl: './youtube-embeded-dialog.component.html',
  styleUrl: './youtube-embeded-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbededDialogComponent
  extends AbstractDialogComponent
  implements OnInit
{
  @ViewChild('thumbnail')
  thumbnail!: ElementRef;

  @Input({ required: true })
  videoId!: string;
  @Input()
  videoName: string = '';

  urlThumbnail: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.scrollStrategiesTypeSelected = 'noop';
    this.backdropClass = 'backdrop-class-youtube-dialog';
    this.getYouTubeThumbnail();
    this.initSubscriptions();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {
    this.pageEventService.resizeEvent$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.onWindowResize();
      });
  }

  getYouTubeThumbnail() {
    const img = new Image();
    img.src = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
    img.onload = () => {
      if (img.width > 120) {
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

  override initContent() {
    this.renderer.setStyle(this.window.document.body, 'overflow', 'hidden');

    if (this.overlayRef) {
      const portal = new ComponentPortal(YoutubeEmbededDialogContentComponent);

      const intance = this.overlayRef.attach(portal);

      intance.instance.videoId = this.videoId;
      intance.instance.videoName = this.videoName;

      intance.instance.submitDialogContentEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: SubmitDialog) => {
          if (submit.typeSubmit === 'confirm') {
            this.submitDialogEmitter.emit(submit);
          } else {
            this.closeOverlay();
          }
        });
    }
  }
}

@Component({
  selector: 'app-confirmation-dialog-content',
  standalone: true,
  imports: [
    MatIconModule,
    OverlayModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDivider,
    ImgComponent,
    YouTubePlayer,
  ],
  templateUrl: './youtube-embeded-dialog-content.component.html',
  styleUrl: './youtube-embeded-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbededDialogContentComponent
  extends AbstractComponent
  implements OnInit
{
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  @ViewChild('youTubePlayer') youTubePlayer!: ElementRef<HTMLDivElement>;

  videoId!: string;

  videoName: string = '';

  playerVars: YT.PlayerVars = { autohide: 0 };
  videoHeight: number | undefined;
  videoWidth: number | undefined;

  constructor() {
    super();
  }

  confirm() {
    this.submitDialog('confirm');
  }

  cancel() {
    this.submitDialog('cancel');
  }

  private submitDialog(submit: submitDialogType) {
    this.submitDialogContentEmitter.emit({
      typeSubmit: submit,
    });
  }

  ngOnInit(): void {}

  override initSelectors(): void {}

  override initSubscriptions(): void {}

  //
}
