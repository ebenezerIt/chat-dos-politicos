import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ParliamentarianDataResponse} from '../client/ParlamentarianResponseDtos';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversation: ParliamentarianDataResponse;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible;
  message = '';
  constructor() {}

  ngOnInit(): void {
    console.log('init');
  }

  submitMessage(event): boolean {
    const value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) {
      return false;
    }
    this.conversation.parliamentarian.latestMessage = value;
    if (!this.conversation.parliamentarian.messages) {
      this.conversation.parliamentarian.messages = [];
    }
    this.conversation.parliamentarian.messages.unshift({
      id: 1,
      body: value,
      time: '10:21',
      me: true,
    });
  }

  emojiClicked(event): void {
    this.message += event.emoji.native;
  }
}
