import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FastAverageColorResult } from 'fast-average-color';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [RouterModule, MatCardModule, CommonModule, NgOptimizedImage],
  templateUrl: './img.component.html',
  styleUrl: './img.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgComponent extends AbstractComponent implements OnInit {
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

  placeholderBase64Person: string =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxwYXRoIGZpbGw9IiNiNWI1YjUiIGlkPSJ1c2VyIiBkPSJNMjcsMjQuMjM2NjlWMjdhMSwxLDAsMCwxLTEsMUg1YTEsMSwwLDAsMS0xLTFWMjQuMjM2NjlhMS41NzgwNiwxLjU3ODA2LDAsMCwxLC45MzExNS0xLjM2NDYyTDEwLjA2NzIsMjAuMTY3QTUuMDIzNzksNS4wMjM3OSwwLDAsMCwxNC41NTI3MywyM2gxLjg5NDU0YTUuMDIzMzYsNS4wMjMzNiwwLDAsMCw0LjQ4NTM1LTIuODMzMTNsNS4xMzYyMywyLjcwNTJBMS41NzgwNiwxLjU3ODA2LDAsMCwxLDI3LDI0LjIzNjY5Wk05LjY0NDc4LDE0LjEyNTczYTIuOTkxNDMsMi45OTE0MywwLDAsMCwxLjMxMDczLDEuNDYybC42NjU4MywzLjA1MTc2QTIuOTk5OTQsMi45OTk5NCwwLDAsMCwxNC41NTIzNywyMWgxLjg5NTI2YTIuOTk5OTQsMi45OTk5NCwwLDAsMCwyLjkzMS0yLjM2MDQ3bC42NjU4My0zLjA1MTc2YTIuOTkxMTUsMi45OTExNSwwLDAsMCwxLjMxMDczLTEuNDYybC4yOC0uNzUxNDZBMS4yNzQ5LDEuMjc0OSwwLDAsMCwyMSwxMS42Mjk4OFY5YzAtMy0yLTUtNS41LTVTMTAsNiwxMCw5djIuNjI5ODhhMS4yNzQ5LDEuMjc0OSwwLDAsMC0uNjM1MTksMS43NDQzOVoiLz4KPC9zdmc+Cg==';

  placeholderBase64Media: string =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxwYXRoIGZpbGw9IiNiNWI1YjUiIGlkPSJwaWN0dXJlIiBkPSJNMjcuNSw1SDQuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMyw2LjV2MTlBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDQuNSwyN2gyM0ExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjksMjUuNVY2LjVBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDI3LjUsNVpNMjYsMTguNWwtNC43OTQyNS01LjIzMDFhLjk5MzgzLjk5MzgzLDAsMCwwLTEuNDQ0MjgtLjAzMTM3bC01LjM0NzQxLDUuMzQ3NDFMMTkuODI4MTIsMjRIMTdsLTQuNzkyOTEtNC43OTNhMS4wMDAyMiwxLjAwMDIyLDAsMCwwLTEuNDE0MTgsMEw2LDI0VjhIMjZabS0xNy45LTZhMi40LDIuNCwwLDEsMSwyLjQsMi40QTIuNDAwMDUsMi40MDAwNSwwLDAsMSw4LjEsMTIuNVoiLz4KPC9zdmc+Cg==';

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {}

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
