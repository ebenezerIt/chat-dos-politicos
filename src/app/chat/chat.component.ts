import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ParliamentarianDataResponse} from '../politicos/ParlamentarianResponseDtos';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversation: ParliamentarianDataResponse;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onClickBack: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible;
  message = '';
  constructor() {}

  ngOnInit(): void {
    if (!this.conversation.parliamentarian.messages) {
      this.conversation.parliamentarian.messages = [];
    }
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
}
