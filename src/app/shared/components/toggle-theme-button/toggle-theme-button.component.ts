import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ToggleThemeService } from '../../../services/toggle-theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toggle-theme-button',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './toggle-theme-button.component.html',
  styleUrl: './toggle-theme-button.component.css',
})
export class ToggleThemeButtonComponent implements AfterViewInit {
  private readonly toggleThemeService = inject(ToggleThemeService);
  $isDarkTheme = this.toggleThemeService.$isDarkTheme;

  destroyed$ = new Subject();

  @ViewChild('sun')
  sun!: ElementRef;
  @ViewChild('moon')
  moon!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.setTheme();
  }

  toggleTheme() {
    this.toggleThemeService.toggleTheme();
    this.setTheme();
  }

  setTheme() {
    if (this.$isDarkTheme()) {
      this.moon.nativeElement.classList = 'opacity-0 transition ';
      this.sun.nativeElement.classList = 'opacity-1 transition ';
    } else {
      this.moon.nativeElement.classList = 'translate-x opacity-1 transition ';
      this.sun.nativeElement.classList = 'translate-x opacity-0 transition ';
    }
  }
}
