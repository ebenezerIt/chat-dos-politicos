import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PoliticosService } from '../politicos/politicos.service';
import { ParliamentarianDataResponse, ParliamentarianListResponse } from '../politicos/ParlamentarianResponseDtos';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

    @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
    searchText: string;
    conversations: ParliamentarianDataResponse[];
    listSize = 20;

    constructor(private politicosService: PoliticosService) {
    }

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

    get filteredConversations(): ParliamentarianDataResponse[] {
        if (!this.searchText) {
            return this.conversations?.slice(0, this.listSize);
        }
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
        conversation.parliamentarian.latestMessageRead = true;
        this.politicosService.getParliamentarianVotesById(conversation.parliamentarianId).subscribe((conversation) => {
            this.conversationClicked.emit(conversation);
        })
    }

    onScroll(): void {
        this.listSize += 10;
    }
}
