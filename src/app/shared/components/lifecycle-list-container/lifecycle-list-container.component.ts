import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-lifecycle-list-container',
  standalone: true,
  imports: [],
  templateUrl: './lifecycle-list-container.component.html',
  styleUrl: './lifecycle-list-container.component.css',
})
export class LifecycleContainerComponent implements OnInit {
  @Input()
  lifecycleId!: number;

  @Output()
  lifecycleIdEmitter = new EventEmitter<number>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.lifecycleIdEmitter.emit(params.lifecycleId);
    });
  }
}
