import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PoliticosService} from '../politicos/politicos.service';
import {ParliamentarianDataResponse, ParliamentarianListResponse} from '../politicos/ParlamentarianResponseDtos';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  searchText: string;
  conversations: ParliamentarianDataResponse[];

  get filteredConversations(): ParliamentarianDataResponse[] {
    return this.conversations.filter((data) => {
      return (
        data.parliamentarian.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        data.parliamentarian.nickname
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

  handleConversationClicked(conversation: ParliamentarianDataResponse): void {
    this.politicosService.getParliamentarianVotesById(conversation.parliamentarianId)
      .subscribe(response => {
        const parliamentarianRanking = response.data.parliamentarianRanking;
        if (parliamentarianRanking) {
          conversation.parliamentarianRanking = parliamentarianRanking;
          conversation.parliamentarian.latestMessageRead = true;
          const lawVotes = parliamentarianRanking.parliamentarian.lawVotes;
          const latestLawVote = lawVotes[0];
          conversation.parliamentarian.latestMessage = latestLawVote.law.number;
          conversation.parliamentarian.latestMessageTime = latestLawVote.law.dateVoting;
        }
        this.conversationClicked.emit(conversation);
      });
  }

  constructor(public politicosService: PoliticosService) {}

  ngOnInit(): void {
    this.politicosService.listParliamentarians()
      .subscribe((response: ParliamentarianListResponse) => {
        this.conversations = response.data;
        this.conversations.forEach(conversation => {
          if (!conversation.parliamentarian.latestMessage) {
            // get by id and enrich
            conversation.parliamentarian.latestMessage = 'MPV 1085/2021 | Mudança nos Serviços de Cartórios';
            conversation.parliamentarian.latestMessageTime = new Date();
          }
        });
      });
  }
}
