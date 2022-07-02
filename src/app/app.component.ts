import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoliticosService } from './politicos/politicos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  conversation;
  showChat = false;
  paramsSubscription : Subscription;
  constructor(private route: ActivatedRoute,
              private politicosService: PoliticosService) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.politicosService.getParliamentarianVotesById(params.id).subscribe((conversation) => {
          console.log(params.id)
          this.conversation = conversation
          this.changeShowChat()
          this.paramsSubscription.unsubscribe()
        })
      }
    })
  }

  onConversationSelected(conversation): void {
    this.conversation = conversation;
    this.changeShowChat()
  }

  changeShowChat() {
    this.showChat = !this.showChat;
  }
}
