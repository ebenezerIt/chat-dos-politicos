import { Component, OnInit } from '@angular/core';
import { StorageEnum } from '../../enums/storage-enum';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onCloseWelcomeIntro(): void {
    localStorage.setItem(StorageEnum.WELCOME_INTRO, JSON.stringify(true));
    window.location.reload()
  }

}
