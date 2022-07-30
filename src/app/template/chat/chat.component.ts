import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ParliamentarianDataResponse} from '../../politicos/ParlamentarianResponseDtos';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../stores/parliamentarians.reducer';
import { RouteEnum } from '../../enums/route-enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  conversation: ParliamentarianDataResponse;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onClickBack: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible;
  message = '';
  paramsSubscription: Subscription;
  RouteEnum = RouteEnum

  constructor(private store: Store<{ parliamentarians: parliamentariansReducerInterface }>,
              private router: Router) {

    store.select('parliamentarians').subscribe(parliamentarians => {
      this.conversation = parliamentarians.currentConversation
    })
  }
  ngOnInit(): void {

  }

  submitMessage(event): void {
    this.message = '';
/*    const value = event.target.value.trim();
    if (value.length < 1) {
      return false;
    }
    this.conversation.parliamentarian.latestMessage = value;
    this.conversation.parliamentarian.messages.unshift({
      id: 1,
      body: value,
      time: '10:21',
      me: true,
    });*/
  }

  emojiClicked(event): void {
    this.message += event.emoji.native;
  }

  clickBack() {
    this.onClickBack.emit()
  }

  selectSwitchChat(routeEnum: RouteEnum): void {
    this.router.navigate([`/${routeEnum}`], {queryParamsHandling: "preserve"})
  }
}
