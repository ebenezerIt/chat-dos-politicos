import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ParliamentarianDataResponse} from '../politicos/ParlamentarianResponseDtos';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog-component/dialog-component.component';

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
  paramsSubscription: Subscription;

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    // if (!this.conversation.parliamentarian.messages) {
    //   this.conversation.parliamentarian.messages = [];
    // }
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (!params.id) {
        this.onClickBack.emit()
      }
    })
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

  openDialog(law: any) {
    console.log("law", law)
    this.dialog.open(DialogComponent, {
        data: {
          message: law.description,
          title: law.number,
        },
    });
  }

  emojiClicked(event): void {
    this.message += event.emoji.native;
  }

  clickBack() {
    this.paramsSubscription.unsubscribe()
    this.onClickBack.emit()
  }
}
