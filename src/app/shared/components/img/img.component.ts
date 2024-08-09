import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FastAverageColorResult } from 'fast-average-color';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [RouterModule, MatCardModule, CommonModule, NgOptimizedImage],
  templateUrl: './img.component.html',
  styleUrl: './img.component.css',
})
export class ImgComponent implements OnInit {
  readonly el = inject(ElementRef);
  readonly router = inject(Router);

  @Input({ required: true })
  imgSrc: string = '';
  @Input()
  baseUrl: string = '';
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

  fullSrc: string = '';

  placeholderBase64Person: string =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxwYXRoIGZpbGw9IiNiNWI1YjUiIGlkPSJwaWN0dXJlIiBkPSJNMjcuNSw1SDQuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMyw2LjV2MTlBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDQuNSwyN2gyM0ExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjksMjUuNVY2LjVBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDI3LjUsNVpNMjYsMTguNWwtNC43OTQyNS01LjIzMDFhLjk5MzgzLjk5MzgzLDAsMCwwLTEuNDQ0MjgtLjAzMTM3bC01LjM0NzQxLDUuMzQ3NDFMMTkuODI4MTIsMjRIMTdsLTQuNzkyOTEtNC43OTNhMS4wMDAyMiwxLjAwMDIyLDAsMCwwLTEuNDE0MTgsMEw2LDI0VjhIMjZabS0xNy45LTZhMi40LDIuNCwwLDEsMSwyLjQsMi40QTIuNDAwMDUsMi40MDAwNSwwLDAsMSw4LjEsMTIuNVoiLz4KPC9zdmc+Cg==';

  placeholderBase64Media: string =
    'data:image/svg+xml;base64,PHN2ZyBpZD0iZ2x5cGhpY29ucy1iYXNpYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxwYXRoIGZpbGw9IiNiNWI1YjUiIGlkPSJwaWN0dXJlIiBkPSJNMjcuNSw1SDQuNUExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMyw2LjV2MTlBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDQuNSwyN2gyM0ExLjUwMDA4LDEuNTAwMDgsMCwwLDAsMjksMjUuNVY2LjVBMS41MDAwOCwxLjUwMDA4LDAsMCwwLDI3LjUsNVpNMjYsMTguNWwtNC43OTQyNS01LjIzMDFhLjk5MzgzLjk5MzgzLDAsMCwwLTEuNDQ0MjgtLjAzMTM3bC01LjM0NzQxLDUuMzQ3NDFMMTkuODI4MTIsMjRIMTdsLTQuNzkyOTEtNC43OTNhMS4wMDAyMiwxLjAwMDIyLDAsMCwwLTEuNDE0MTgsMEw2LDI0VjhIMjZabS0xNy45LTZhMi40LDIuNCwwLDEsMSwyLjQsMi40QTIuNDAwMDUsMi40MDAwNSwwLDAsMSw4LjEsMTIuNVoiLz4KPC9zdmc+Cg==';

  constructor() {}
  ngOnInit(): void {
    this.buildCard1or2xImgUrl();
  }

  buildCard1or2xImgUrl() {
    if (this.imgSrc) {
      this.fullSrc = `${this.baseUrl}${this.imgSrc}`;
    } else {
      this.fullSrc = this.isPlaceholderPerson
        ? '../../../../assets/images/glyphicons-basic-4-user-grey.svg'
        : '../../../../assets/images/glyphicons-basic-38-picture-grey.svg';
    }
  }

  navigateTo() {
    if (this.link) {
      this.router.navigate([`${this.link}`]);
    }
  }
}
