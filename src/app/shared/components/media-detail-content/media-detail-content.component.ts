import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';
import { Cast, Crew } from '../../interfaces/TMDB/tmdb-media.interface';
import { FormatMinutesPipe } from '../../pipes/format-minutes.pipe';
@Component({
  selector: 'app-media-detail-content',
  standalone: true,
  imports: [CommonModule, RatingComponent, FormatMinutesPipe],
  templateUrl: './media-detail-content.component.html',
  styleUrl: './media-detail-content.component.css',
})
export class MediaDetailContentComponent implements OnInit {
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

  mainCrewList: { [key: number]: { name: string; job: string } } = {};
  mainCastList: { [key: number]: { name: string; character: string } } = {};

  constructor() {}

  ngOnInit(): void {
    console.log('init MediaDetailContentComponent');
    this.buildMainCrewList();
    this.buildMainCastList();
  }

  buildMainCrewList() {
    this.crewList.forEach((crew: Crew) => {
      let job = crew.job.toLowerCase();
      if (job === 'director' || job === 'writer' || job === 'characters') {
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

    console.log(this.mainCastList);
  }
}
