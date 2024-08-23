import { Directive, inject } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractPersonCardComponent extends AbstractComponent {
  detailMediaPath: string = '';

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(`/person-detail/${id}`);
  }
}
