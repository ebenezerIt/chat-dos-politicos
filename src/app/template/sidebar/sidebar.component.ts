import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PoliticosService } from '../../politicos/politicos.service';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';
import { SwitchFilterEnum } from '../../enums/switch-filter-enum';
import { RadioFilterEnum } from '../../enums/radio-filter-enum';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../stores/parliamentarians.reducer';
import { setCurrentConversation } from '../../stores/parliamentarians.actions';
import { Router } from '@angular/router';
import { RouteEnum } from '../../enums/route-enum';

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
    SwitchFilterEnum = SwitchFilterEnum
    RadioFilterEnum = RadioFilterEnum
    selectedSwitchFilterEnum: SwitchFilterEnum = SwitchFilterEnum.POLITICIANS
    selectedRadioChamberEnum = true
    selectedRadioSenateEnum = true
    RouteEnum = RouteEnum

    constructor(private politicosService: PoliticosService,
                private router: Router,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface }>) {

        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversations = parliamentarians.list
        })
    }

    ngOnInit(): void {

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
        this.politicosService.getParliamentarianVotesById(conversation.parliamentarianId).subscribe((conversation) => {
            this.conversationClicked.emit();
            this.router.navigate([`/${RouteEnum.Votes}`], {queryParams: {id: conversation.parliamentarianRanking.parliamentarianId}})
            this.store.dispatch(setCurrentConversation({currentConversation: conversation}))
        })
    }

    onScroll(): void {
        this.listSize += 10;
    }

    selectSwitchFilter(switchFilterEnum: SwitchFilterEnum): void {
        this.selectedSwitchFilterEnum = switchFilterEnum
    }

    selectRadioFilter(radioFilterEnum: RadioFilterEnum): void {
        if (radioFilterEnum === RadioFilterEnum.SENATE && this.selectedRadioChamberEnum) {
            this.selectedRadioSenateEnum = !this.selectedRadioSenateEnum
        }

        if (radioFilterEnum === RadioFilterEnum.CHAMBER && this.selectedRadioSenateEnum) {
            this.selectedRadioChamberEnum = !this.selectedRadioChamberEnum
        }
    }
}
