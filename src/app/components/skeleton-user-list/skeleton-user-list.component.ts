import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-user-list',
  templateUrl: './skeleton-user-list.component.html',
  styleUrls: ['./skeleton-user-list.component.scss'],
})
export class SkeletonUserListComponent implements OnInit {
  index = [1, 2, 3, 4, 5, 6];

  constructor() {}

  ngOnInit(): void {}
}
