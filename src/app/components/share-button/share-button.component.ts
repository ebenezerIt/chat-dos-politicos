import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent{
  @HostListener('document:click')
  clickOutside() {
    if (this.active) this.toggleOptions();
  }
  @Input() bottom = '150px'

  active = false
  constructor(
  ) { }

  toggleOptions(event?: Event):void {
    event?.stopPropagation();
    const wrapperEl = document.querySelector('.wrapper');
    wrapperEl.classList.toggle('active');
    this.active =! this.active
  }
}
