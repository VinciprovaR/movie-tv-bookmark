import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cast } from '../../interfaces/TMDB/tmdb-media.interface';
import { PeopleItemComponent } from '../people-item/people-item.component';

@Component({
  selector: 'app-people-list-container',
  standalone: true,
  imports: [CommonModule, PeopleItemComponent],
  templateUrl: './people-list-container.component.html',
  styleUrl: './people-list-container.component.css',
})
export class PeopleListContainerComponent implements OnInit {
  @Input({ required: true })
  isLoading: boolean = false;
  @Input({ required: true })
  castList!: Cast[];

  constructor() {}
  ngOnInit(): void {}
}
