import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ParliamentarianDataResponse} from '../../politicos/ParlamentarianResponseDtos';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../stores/parliamentarians/parliamentarians.reducer';
import { RouteEnum } from '../../constants/route-enum';
import { ActivatedRoute, Router } from '@angular/router';

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
  RouteEnum = RouteEnum;

  constructor(private route: ActivatedRoute,
              store: Store<{ parliamentarians: parliamentariansReducerInterface }>,
              private router: Router) {

    store.select('parliamentarians').subscribe(parliamentarians => {
      this.conversation = parliamentarians.currentConversation;
    });
  }
  ngOnInit(): void {

    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (!params.id) {
        this.clickBack();
      }
    });
  }

  submitMessage(): void {
    this.message = '';
/*    const value = event.target.value.trim();
    if (value.length < 1) {
      return false;
    }
    this.conversation.parliamentarian.latestMessage = value;
    this.conversation.parliamentarian.messages.unshift({
      id: 1,s
      body: value,
      time: '10:21',
      me: true,
    });*/
  }

  emojiClicked(event): void {
    this.message += event.emoji.native;
  }

  clickBack(): void {
    this.onClickBack.emit();
    this.paramsSubscription.unsubscribe();
  }

  selectSwitchChat(routeEnum: RouteEnum): void {
    this.router.navigate([`/${routeEnum}`], {queryParamsHandling: 'preserve'});
  }
}
