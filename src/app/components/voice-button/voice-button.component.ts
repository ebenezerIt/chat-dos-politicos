import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-voice-button',
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent {
  @HostListener('document:click')
  clickOutside() {
  }
  @Input() bottom = '110px'

  active = false
  constructor(
  ) { }

} 
