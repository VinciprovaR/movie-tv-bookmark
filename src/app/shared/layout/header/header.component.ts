import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NavigatorComponent } from '../../../features/navigator/navigator.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavigatorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
