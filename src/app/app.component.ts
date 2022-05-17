import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  conversation;
  showChat = false;

  onConversationSelected(conversation): void {
    this.conversation = conversation;
    this.changeShowChat()
  }

  changeShowChat() {
    this.showChat = !this.showChat;
  }
}