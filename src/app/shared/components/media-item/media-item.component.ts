import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.css',
})
export class MediaItemComponent implements OnInit {
  @Input()
  mediaItemTitle!: string;
  @Input()
  mediaItemOverview!: string;
  @Input()
  mediaItemType!: string;
  @Input()
  idMedia: number = 0;

  detailRouterLink: string = '/movie-detail';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.detailRouterLink = this.detailRouterLink.concat(`/${this.idMedia}`);
  }

  goToDetail() {
    //this.router.navigate([`/movie-detail/${this.idMedia}`]);
  }
}
