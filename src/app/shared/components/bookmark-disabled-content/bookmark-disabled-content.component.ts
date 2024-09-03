

import { OverlayModule } from "@angular/cdk/overlay";
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { AbstractComponent } from "../abstract/abstract-component.component";

@Component({
  selector: 'app-bookmark-disabled-content',
  standalone: true,
  imports: [MatIconModule, OverlayModule, RouterLink],
  templateUrl: './bookmark-disabled-content.component.html',
  styleUrl: './bookmark-disabled-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkDisabledContentComponent extends AbstractComponent {
  @Output()
  closeOverlayEmitter = new EventEmitter<null>();

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  closeOverlay() {
    this.closeOverlayEmitter.emit(null);
  }
}