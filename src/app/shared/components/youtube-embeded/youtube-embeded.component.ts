import { Component, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
@Component({
  selector: 'app-youtube-embeded',
  standalone: true,
  imports: [YouTubePlayer],

  templateUrl: './youtube-embeded.component.html',
  styleUrl: './youtube-embeded.component.css',
})
export class YoutubeEmbededComponent implements OnInit {
  readonly domSanitizer = inject(DomSanitizer);

  @Input({ required: true })
  videoId!: string;

  urlVideo: string = 'https://www.youtube.com/embed/';
  height = 600;
  width = 1200;
  constructor() {}

  ngOnInit(): void {
    this.urlVideo = this.urlVideo.concat(this.videoId);
    console.log(this.urlVideo);
  }
}
