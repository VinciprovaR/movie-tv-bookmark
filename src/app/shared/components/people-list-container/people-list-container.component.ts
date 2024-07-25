import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieItemSupabaseComponent } from '../movie-item-supabase/movie-item-supabase.component';
import { MovieItemTmdbComponent } from '../movie-item-tmdb/movie-item-tmdb.component';
import { TVItemSupabaseComponent } from '../tv-item-supabase/tv-item-supabase.component';
import { TVItemTmdbComponent } from '../tv-item-tmdb/tv-item-tmdb.component';
import { ListType } from '../../interfaces/list-type.type';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { PeopleItemComponent } from '../people-item/people-item.component';

@Component({
  selector: 'app-people-list-container',
  standalone: true,
  imports: [CommonModule, PeopleItemComponent],
  templateUrl: './people-list-container.component.html',
  styleUrl: './people-list-container.component.css',
})
export class PeopleListContainerComponent implements OnInit {
  readonly peopleItemComponents = {
    movie: {
      supabase: MovieItemSupabaseComponent,
      tmdb: MovieItemTmdbComponent,
    },
    tv: {
      supabase: TVItemSupabaseComponent,
      tmdb: TVItemTmdbComponent,
    },
  };

  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  peopleList!: Person[];
  @Input()
  placeholder!: string;
  @Input()
  minMaxCol: number = 160;

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

  constructor() {}
  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

    this.placeholder = `No people were found that match your query.`;
  }
}
