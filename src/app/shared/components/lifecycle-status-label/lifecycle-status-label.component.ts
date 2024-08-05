import { Component, inject, Input } from '@angular/core';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { lifecycleEnum } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lifecycle-status-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lifecycle-status-label.component.html',
  styleUrl: './lifecycle-status-label.component.css',
})
export class LifecycleStatusLabelComponent {
  readonly lifecycleStatusMap = inject(LIFECYCLE_STATUS_MAP);

  @Input()
  customClass: string = '';

  @Input({ required: true })
  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';
}
