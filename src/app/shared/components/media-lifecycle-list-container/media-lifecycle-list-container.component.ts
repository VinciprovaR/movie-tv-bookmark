import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../media-list-container/media-list-container.component';
import { ScrollNearEndDirective } from '../../directives/scroll-near-end.directive';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';
import { CommonModule } from '@angular/common';
import { Movie, TV } from '../../interfaces/media.interface';
import { TV_Data } from '../../interfaces/supabase/entities/tv_data.entity.interface';

@Component({
  selector: 'app-media-lifecycle-list-container',
  standalone: true,
  imports: [MediaListContainerComponent, CommonModule],

  templateUrl: './media-lifecycle-list-container.component.html',
  styleUrl: './media-lifecycle-list-container.component.css',
})
export class MediaLifecycleContainerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly destroyRef$ = inject(DestroyRef);

  @Input()
  lifecycleType!: string;

  destroyed$ = new Subject();

  mediaListResultByLifecycle$!: Observable<Movie[] | TV[]>;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        this.bridgeDataService.pushLifecycleTypeSearch(params.lifecycleType);
      });

    this.initBridgeData();
  }

  initBridgeData() {
    this.mediaListResultByLifecycle$ =
      this.bridgeDataService.mediaListResultByLifecycleObs$.pipe(
        map((movieListResultByLifecycle: Movie_Data[] | TV_Data[]) => {
          let result = movieListResultByLifecycle as Movie[] | TV[];
          console.log(result);
          return result;
        })
      );

    //.subscribe((v) => {console.log('result for media lifecycle list ', v);});
  }
}
