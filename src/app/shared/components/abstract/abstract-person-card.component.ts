import { Directive } from '@angular/core';
import { AbstractCardComponent } from './abstract-card.component';

@Directive()
export abstract class AbstractPersonCardComponent extends AbstractCardComponent {
  detailMediaPath: string = '';

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(`/person-detail/${id}`);
  }
}
