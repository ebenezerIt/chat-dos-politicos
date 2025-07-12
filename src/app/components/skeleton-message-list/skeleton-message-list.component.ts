import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-msg-list',
  templateUrl: './skeleton-message-list.component.html',
  styleUrls: ['./skeleton-message-list.component.scss'],
})
export class SkeletonMessageListComponent implements OnInit {
  @Input() index: number;
  constructor() {}

  ngOnInit(): void {}

  counter(index: number) {
    return new Array(index);
  }
}
