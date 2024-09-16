import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FastAverageColorResult } from 'fast-average-color';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [RouterModule, MatCardModule, CommonModule, NgOptimizedImage],
  templateUrl: './img.component.html',
  styleUrl: './img.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgComponent extends AbstractComponent {
  @Input({ required: true })
  breakpointSm!: number;
  @Input({ required: true })
  imgSrc: string = '';
  @Input({ required: true })
  baseUrlSm: string = '';
  @Input({ required: true })
  baseUrlLg: string = '';
  @Input()
  width!: number;
  @Input()
  height!: number;
  @Input()
  customContainerHeightClass: string = 'h-full';
  @Input()
  customClasses: string = '';
  @Input()
  state: any;
  @Input()
  isPlaceholderPerson: boolean = false;
  @Input()
  alt: string = '';
  @Input()
  title: string = '';
  @Input()
  link: string = '';
  @Input()
  priority: boolean = false;
  @Output()
  predominantColor = new EventEmitter<FastAverageColorResult>();

  imageLoadIsError: boolean = false;

  placeholderSrc: string = '';

  placeholderBase64 =
    'data:image/svg+xml;base64,ICAgIDxzdmcNCiAgICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgICAgIHZpZXdCb3g9IjAgMCAxMDAgMTAwIg0KICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSINCiAgICAgIHdpZHRoPSIxMDAlIg0KICAgICAgaGVpZ2h0PSIxMDAlIg0KICAgID4NCiAgICAgIDwhLS0gRGVmaW5lIGdyYWRpZW50IGZvciB0aGUgc2hpbW1lcmluZyBkaWFnb25hbCBsaW5lIC0tPg0KICAgICAgPGRlZnM+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ic2hpbW1lciIgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9InJnYmEoMTYzLDIwOSwyNTUsMCkiIC8+DQogICAgICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9InJnYmEoMTYzLDIwOSwyNTUsMC40KSIgLz4NCiAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9InJnYmEoMTYzLDIwOSwyNTUsMCkiIC8+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICA8L2RlZnM+DQoNCiAgICAgIDwhLS0gTW92aW5nIGRpYWdvbmFsIGxpbmUgKG5hcnJvdyByZWN0YW5nbGUgd2l0aCBncmFkaWVudCkgLS0+DQogICAgICA8cmVjdA0KICAgICAgICB3aWR0aD0iMTAwJSINCiAgICAgICAgaGVpZ2h0PSIxMDAlIg0KICAgICAgICBmaWxsPSJ1cmwoI3NoaW1tZXIpIg0KICAgICAgICB0cmFuc2Zvcm09InJvdGF0ZSg0NSA1MCA1MCkiDQogICAgICA+DQogICAgICAgIDwhLS0gQW5pbWF0ZSB0aGUgc2hpbW1lcmluZyBkaWFnb25hbCBsaW5lIG1vdmluZyBob3Jpem9udGFsbHkgLS0+DQogICAgICAgIDxhbmltYXRlVHJhbnNmb3JtDQogICAgICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIg0KICAgICAgICAgIHR5cGU9InRyYW5zbGF0ZSINCiAgICAgICAgICBmcm9tPSItMTUwLCAwIg0KICAgICAgICAgIHRvPSIxNTAsIDAiDQogICAgICAgICAgZHVyPSIxLjJzIg0KICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIg0KICAgICAgICAvPg0KICAgICAgPC9yZWN0Pg0KICAgIDwvc3ZnPg==';

  constructor() {
    super();
  }

  getFullSrc() {
    if (window.innerWidth < this.breakpointSm) {
      return `${this.baseUrlSm}${this.imgSrc}`;
    } else {
      return `${this.baseUrlLg}${this.imgSrc}`;
    }
  }

  // getFullSrcSet() {
  //   return `${this.baseUrlSm}${this.imgSrc} 1x, ${this.baseUrlLg}${this.imgSrc} 2x`;
  // }

  getImgBackground() {
    return this.isPlaceholderPerson
      ? `url('assets/images/glyphicons-basic-4-user-grey.svg')`
      : `url('assets/images/glyphicons-basic-38-picture-grey.svg')`;
  }

  navigateTo() {
    if (this.link) {
      this.router.navigate([`${this.link}`]);
    }
  }

  onError() {
    this.imageLoadIsError = true;
    this.detectChanges();
  }
}
