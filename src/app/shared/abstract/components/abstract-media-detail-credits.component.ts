import { Directive, inject, signal, WritableSignal } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractMediaDetailCreditsComponent extends AbstractComponent {
  readonly TMDB_BACKDROP_W_300_IMG_URL = inject(
    IMG_SIZES.TMDB_BACKDROP_W_300_IMG_URL
  );

  $isHideCastContainer: WritableSignal<boolean> = signal(false);
  $isHideCrewContainer: WritableSignal<boolean> = signal(false);

  constructor() {
    super();
  }

  toggleCast() {
    if (window.innerWidth < 1024) {
      this.$isHideCastContainer.set(!this.$isHideCastContainer());
    }
  }
  toggleCrew() {
    if (window.innerWidth < 1024) {
      this.$isHideCrewContainer.set(!this.$isHideCrewContainer());
    }
  }

  resetHideContainers() {
    this.$isHideCastContainer.set(false);
    this.$isHideCrewContainer.set(false);
  }
}
