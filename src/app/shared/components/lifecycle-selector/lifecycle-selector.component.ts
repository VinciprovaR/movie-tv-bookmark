import {
  Component,
  DestroyRef,
  Inject,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { MediaType } from '../../models/media.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Media_Lifecycle_Options } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';

@Component({
  selector: 'app-lifecycle-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './lifecycle-selector.component.html',
  styleUrl: './lifecycle-selector.component.css',
})
export class LifecycleSelectorComponent implements OnInit {
  destroyed$ = new Subject();

  @Input({ required: true })
  mediaId!: number;
  @Input({ required: true })
  lifecycleId!: number | undefined;
  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;
  lifecycleControl!: FormControl;
  options$!: Observable<SelectLifecycleDTO[] | []>;
  lifecycleOptions$!: Observable<Media_Lifecycle_Options[] | []>;

  constructor(
    private fb: FormBuilder,
    private bridgeDataService: BridgeDataService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  //to-do refractor? no selector, hardcoded, più leggero
  ngOnInit(): void {
    this.options$ = this.bridgeDataService.selectLifecycleOptionsObs$;

    this.lifecycleControl = this.fb.control(
      this.lifecycleId ? this.lifecycleId : 0
    );

    this.lifecycleControl.valueChanges
      .pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((lifecycleId) => {
        this.setLifeCycle(lifecycleId);
      });
  }

  setLifeCycle(lifecycleId: number) {
    let mediaLifecycleDTO: MediaLifecycleDTO = {
      mediaId: this.mediaId,
      lifecycleId: +lifecycleId,
      index: this.index,
    };

    this.bridgeDataService.pushInputLifecycleOptions(mediaLifecycleDTO);
  }
}
