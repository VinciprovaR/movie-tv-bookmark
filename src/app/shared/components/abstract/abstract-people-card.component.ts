import { Directive, OnInit } from '@angular/core';
import { AbstractCard } from './abstract-card.component';

@Directive()
export abstract class AbstractPeopleCardComponent
  extends AbstractCard
  implements OnInit
{
  override buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(`/person-detail/${id}`);
  }
}
