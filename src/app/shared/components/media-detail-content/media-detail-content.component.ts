import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';
import {
  Cast,
  Crew,
  MediaCredit,
  MovieDetail,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
import { FastAverageColorResult } from 'fast-average-color';
import { PredominantImgColorService } from '../../predominant-img-color.service';
import { Observable, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-media-detail-content',
  standalone: true,
  imports: [CommonModule, RatingComponent, FormatMinutesPipe],
  templateUrl: './media-detail-content.component.html',
  styleUrl: './media-detail-content.component.css',
})
export class MediaDetailContentComponent implements OnInit, AfterViewInit {
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  readonly predominantImgColorService = inject(PredominantImgColorService);

  private readonly destroyRef$ = inject(DestroyRef);

  destroyed$ = new Subject();
  predominantColorResultObs$!: Observable<FastAverageColorResult>;

  @Input({ required: true })
  mediaData!: (MovieDetail & MediaCredit) | (TVDetail & MediaCredit);
  @Input({ required: true })
  mediaTitle: string = '';
  @Input({ required: true })
  tagLine: string = '';
  @Input({ required: true })
  releaseDate: string = '';
  @Input({ required: true })
  genres: Genre[] = [];
  @Input({ required: true })
  runtime: number = 0;
  @Input({ required: true })
  overview: string = '';
  @Input({ required: true })
  crewList: Crew[] = [];
  @Input({ required: true })
  castList: Cast[] = [];
  @Input()
  voteAverage: number = 0;
  @Input()
  certification: string = '';
  @Input()
  backdropPath: string = '';
  @Input()
  isSmallContainer: boolean = false;

  mainCrewMap: { directors: string[]; witers: string[] } = {
    directors: [],
    witers: [],
  };
  mainCrewList: { [key: number]: { name: string; job: string } } = {};
  mainCastList: { [key: number]: { name: string; character: string } } = {};

  @ViewChild('contentContainer')
  contentContainer!: ElementRef;

  constructor() {}
  ngAfterViewInit(): void {
    this.setPredominantColor();
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.buildMainCrewList();
    this.buildMainCastList();
  }

  setPredominantColor() {
    this.predominantImgColorService
      .evaluatePredominantColor(this.mediaData.backdrop_path)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((colorResult: FastAverageColorResult) => {
        if (this.isSmallContainer) {
          this.renderer.setStyle(
            this.contentContainer.nativeElement,
            'background-image',
            `linear-gradient(to bottom right, rgba(${colorResult.value[0]},${colorResult.value[1]},${colorResult.value[2]},1), rgba(${colorResult.value[0]},${colorResult.value[1]},${colorResult.value[2]}, 1))`
          );
        }

        if (colorResult.isDark) {
          this.renderer.setStyle(
            this.contentContainer.nativeElement,
            'color',
            'var(--text-color-light) !important'
          );
        } else {
          this.renderer.setStyle(
            this.contentContainer.nativeElement,
            'color',
            'var(--text-color-dark) !important'
          );
        }
      });
  }

  buildMainCrewMap() {
    this.crewList.forEach((crew: Crew) => {
      let department = crew.department.toLowerCase();
      let job = crew.job.toLowerCase();
      if (department === 'director' || job === 'director') {
        this.mainCrewMap.directors.push(crew.name);
      }

      if (
        department === 'writer' ||
        department === 'writing' ||
        job === 'writer' ||
        job === 'writing'
      ) {
        this.mainCrewMap.witers.push(crew.name);
      }
    });
  }
  buildMainCrewList() {
    this.crewList.forEach((crew: Crew) => {
      let department = crew.department.toLowerCase();
      if (
        department === 'director' ||
        department === 'writer' ||
        department === 'writing' ||
        department === 'characters'
      ) {
        if (!this.mainCrewList[crew.id]) {
          this.mainCrewList[crew.id] = {
            name: crew.name,
            job: crew.department,
          };
        } else {
          this.mainCrewList[crew.id].job = this.mainCrewList[
            crew.id
          ].job.concat(`, ${crew.department}`);
        }
      }
      let job = crew.job.toLowerCase();
      if (
        job === 'director' ||
        job === 'writer' ||
        job === 'writing' ||
        job === 'characters'
      ) {
        if (!this.mainCrewList[crew.id]) {
          this.mainCrewList[crew.id] = { name: crew.name, job: crew.job };
        } else {
          this.mainCrewList[crew.id].job = this.mainCrewList[
            crew.id
          ].job.concat(`, ${crew.job}`);
        }
      }
    });
  }

  buildMainCastList() {
    this.castList.forEach((cast: Cast) => {
      if (!this.mainCastList[cast.id]) {
        this.mainCastList[cast.id] = {
          name: cast.name,
          character: cast.character,
        };
      } else {
        this.mainCastList[cast.id].character = this.mainCastList[
          cast.id
        ].character.concat(`, ${cast.character}`);
      }
    });
  }
}
