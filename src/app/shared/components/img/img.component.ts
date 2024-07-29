import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [RouterModule, MatCardModule, CommonModule, NgOptimizedImage],
  templateUrl: './img.component.html',
  styleUrl: './img.component.css',
})
export class ImgComponent implements OnInit, OnDestroy {
  readonly el = inject(ElementRef);

  @Input({ required: true })
  imgSrc: string = '';
  @Input({ required: true })
  url1x!: string;
  @Input({ required: true })
  url2x!: string;
  @Input({ required: true })
  width: number = 0;
  @Input({ required: true })
  heigth: number = 0;
  @Input()
  alt: string = '';
  @Input()
  title: string = '';
  @Input()
  link: string = '';
  @Input()
  relativeSize: number = 52;
  @Input()
  isPlaceholderPerson: boolean = false;
  @Input({ required: true })
  placeholderKey!: string;

  placeholderHeight: number = 0;

  card1or2xImgUrl: string = '';

  displayImg: boolean = false;

  timestampDifferences: number = 0;
  prevTimestamp: number = 0;
  currTimestamp: number = 0;

  ngOnInit(): void {
    this.buildCard1or2xImgUrl();
    // this.calculateRelativeSize();
  }

  @HostListener(`window:resize`, ['$event.target'])
  onSizeChange() {
    // this.calculateRelativeSize();
    // if (!this.imgSrc) {
    //   let currTimestamp = new Date().getTime();
    //   if (currTimestamp - this.prevTimestamp > 500) {
    //     console.log('resize');
    //   }
    //   this.prevTimestamp = currTimestamp;
    // }
  }

  calculateRelativeSize() {
    this.placeholderHeight = Math.trunc(
      this.el.nativeElement.clientWidth +
        (this.el.nativeElement.clientWidth / 100) * this.relativeSize
    );
  }

  buildCard1or2xImgUrl() {
    this.placeholderBase64 = this.placeholders[this.placeholderKey].base64;
    if (this.imgSrc) {
      this.card1or2xImgUrl = `${this.url1x}${this.imgSrc}`;
    } else {
      this.card1or2xImgUrl = this.placeholders[this.placeholderKey].src;
    }
  }

  load() {
    this.displayImg = !this.displayImg;
  }

  ngOnDestroy(): void {}
  placeholderBase64: string = '';
  base64Placeholder_w220_h330 =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxwYXRoIGZpbGw9IiNiNWI1YjUiIGlkPSJwaWN0dXJlIiBkPSJNMjcuNSw1SDQuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMyw2LjV2MTlBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDQuNSwyN2gyM0ExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjksMjUuNVY2LjVBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDI3LjUsNVpNMjYsMTguNWwtNC43OTQyNS01LjIzMDFhLjk5MzgzLjk5MzgzLDAsMCwwLTEuNDQ0MjgtLjAzMTM3bC01LjM0NzQxLDUuMzQ3NDFMMTkuODI4MTIsMjRIMTdsLTQuNzkyOTEtNC43OTNhMS4wMDAyMiwxLjAwMDIyLDAsMCwwLTEuNDE0MTgsMEw2LDI0VjhIMjZabS0xNy45LTZhMi40LDIuNCwwLDEsMSwyLjQsMi40QTIuNDAwMDUsMi40MDAwNSwwLDAsMSw4LjEsMTIuNVoiLz4KPC9zdmc+Cg==';

  base64Placeholder_w138_h175 =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIxMzhweCIgaGVpZ2h0PSIxNzVweCI+CiAgPHBhdGggZmlsbD0iI2I1YjViNSIgaWQ9InBpY3R1cmUiIGQ9Ik0yNy41LDVINC41QTEuNTAwMDgsMS41MDAwOCwwLDAsMCwzLDYuNXYxOUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsNC41LDI3aDIzQTEuNTAwMDgsMS41MDAwOCwwLDAsMCwyOSwyNS41VjYuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjcuNSw1Wk0yNiwxOC41bC00Ljc5NDI1LTUuMjMwMWEuOTkzODMuOTkzODMsMCwwLDAtMS40NDQyOC0uMDMxMzdsLTUuMzQ3NDEsNS4zNDc0MUwxOS44MjgxMiwyNEgxN2wtNC43OTI5MS00Ljc5M2ExLjAwMDIyLDEuMDAwMjIsMCwwLDAtMS40MTQxOCwwTDYsMjRWOEgyNlptLTE3LjktNmEyLjQsMi40LDAsMSwxLDIuNCwyLjRBMi40MDAwNSwyLjQwMDA1LDAsMCwxLDguMSwxMi41WiIvPgo8L3N2Zz4K';

  base64Placeholder_w300_h450 =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIzMDBweCIgaGVpZ2h0PSI0NTBweCI+CiAgPHBhdGggZmlsbD0iI2I1YjViNSIgaWQ9InBpY3R1cmUiIGQ9Ik0yNy41LDVINC41QTEuNTAwMDgsMS41MDAwOCwwLDAsMCwzLDYuNXYxOUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsNC41LDI3aDIzQTEuNTAwMDgsMS41MDAwOCwwLDAsMCwyOSwyNS41VjYuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjcuNSw1Wk0yNiwxOC41bC00Ljc5NDI1LTUuMjMwMWEuOTkzODMuOTkzODMsMCwwLDAtMS40NDQyOC0uMDMxMzdsLTUuMzQ3NDEsNS4zNDc0MUwxOS44MjgxMiwyNEgxN2wtNC43OTI5MS00Ljc5M2ExLjAwMDIyLDEuMDAwMjIsMCwwLDAtMS40MTQxOCwwTDYsMjRWOEgyNlptLTE3LjktNmEyLjQsMi40LDAsMSwxLDIuNCwyLjRBMi40MDAwNSwyLjQwMDA1LDAsMCwxLDguMSwxMi41WiIvPgo8L3N2Zz4K';

  readonly placeholders: any = {
    placeholder_w220_h330: {
      src: '../../../../assets/images/glyphicons-basic-38-picture-grey-w220-h330.svg',
      base64: this.base64Placeholder_w220_h330,
    },
    placeholder_w138_h175: {
      src: ' ../../../../assets/images/glyphicons-basic-38-picture-grey-w138-h175.svg',
      base64: this.base64Placeholder_w138_h175,
    },

    placeholder_w300_h450: {
      src: '../../../../assets/images/glyphicons-basic-38-picture-grey-w300-h450.svg',
      base64: this.base64Placeholder_w300_h450,
    },
  };
}
