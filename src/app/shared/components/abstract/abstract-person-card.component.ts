import { Directive } from '@angular/core';

@Directive()
export abstract class AbstractPersonCardComponent {
  detailMediaPath: string = '';

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(`/person-detail/${id}`);
  }
}
