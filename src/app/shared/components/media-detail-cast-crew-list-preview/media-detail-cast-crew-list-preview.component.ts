import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { FadeScrollerDirective } from '../../directives/fade-scroller.directive';
import { AbstractComponent } from '../abstract/abstract-component.component';
import {
  CastMovie,
  CrewMovie,
  CastTV,
  CrewTV,
  Role,
  Job,
  MediaType,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-media-detail-cast-crew-list-preview',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    CastCrewCardComponent,
    FadeScrollerDirective,
    MissingFieldPlaceholderComponent,
    MatIconModule,
  ],
  templateUrl: './media-detail-cast-crew-list-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDetailCastCrewListPreviewComponent
  extends AbstractComponent
  implements OnInit
{
  @ViewChildren('crewCast')
  castCrewCardComponentList!: QueryList<CastCrewCardComponent>;
  @Input({ required: true })
  title: string = '';
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  castCrewList: CastMovie[] | CrewMovie[] | CastTV[] | CrewTV[] = [];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  minMaxCol: number = 160;
  @Output()
  navigateToCreditsEmitter = new EventEmitter<null>();

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;
  crewIdList: number[] = [];
  objType!: 'castMovie' | 'crewMovie' | 'castTV' | 'crewTV';
  placeholder: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.placeholder = `No ${this.title.toLowerCase()} found for this ${
      this.mediaType
    }`;
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;
  }

  buildRole(castCrew: CastMovie | CrewMovie | CastTV | CrewTV) {
    if (this.isCastTVEntity(castCrew)) {
      return this.buildCharacterTV(castCrew);
    } else if (this.isCrewTVEntity(castCrew)) {
      return this.buildJobTV(castCrew);
    } else if (this.isCastMovieEntity(castCrew)) {
      return this.buildCharacterMovie(castCrew);
    } else {
      return this.buildJobMovie(castCrew);
    }
  }

  private isCastTVEntity(
    cast: CastMovie | CrewMovie | CastTV | CrewTV
  ): cast is CastTV {
    return (
      (cast as CastTV)?.total_episode_count !== undefined &&
      (cast as CastTV)?.roles !== undefined
    );
  }

  private isCrewTVEntity(
    crew: CastMovie | CrewMovie | CastTV | CrewTV
  ): crew is CrewTV {
    return (
      (crew as CrewTV).total_episode_count !== undefined &&
      (crew as CrewTV).jobs !== undefined
    );
  }

  private isCastMovieEntity(
    cast: CastMovie | CrewMovie | CastTV | CrewTV
  ): cast is CastMovie {
    return (cast as CastMovie).character !== undefined;
  }

  private isCrewMovieEntity(
    cast: CastMovie | CrewMovie | CastTV | CrewTV
  ): cast is CrewMovie {
    return (cast as CrewMovie).job !== undefined;
  }

  private buildCharacterTV(cast: CastTV): string {
    let roleResult = '';
    cast.roles.forEach((role: Role, i, array) => {
      if (i === array.length - 1) {
        roleResult = roleResult.concat(role.character);
      } else {
        roleResult = roleResult.concat(role.character, ' / ');
      }
    });
    return roleResult;
  }

  private buildJobTV(crew: CrewTV): string {
    let roleResult = '';
    crew.jobs.forEach((job: Job, i, array) => {
      if (i === array.length - 1) {
        roleResult = roleResult.concat(job.job);
      } else {
        roleResult = roleResult.concat(job.job, ' / ');
      }
    });
    return roleResult;
  }

  private buildCharacterMovie(cast: CastMovie): string {
    return cast.character;
  }

  private buildJobMovie(crew: CrewMovie): string {
    return crew.job;
  }
  navigateToCredits() {
    this.navigateToCreditsEmitter.emit(null);
  }
}
