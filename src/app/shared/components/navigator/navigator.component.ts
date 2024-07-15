import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinkPath } from '../../interfaces/navigator.interface';
@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css',
})
export class NavigatorComponent {
  @Input({ required: true })
  linkPathList!: LinkPath[];

  constructor() {}
}
