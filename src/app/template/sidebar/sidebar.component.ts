import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { PoliticosService } from '../../politicos/politicos.service';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';
import { SwitchFilterEnum } from '../../constants/switch-filter-enum';
import { RadioFilterEnum } from '../../constants/radio-filter-enum';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../stores/parliamentarians/parliamentarians.reducer';
import {
    setChatListType,
    setCurrentConversation,
    setCurrentLaw
} from '../../stores/parliamentarians/parliamentarians.actions';
import { Router } from '@angular/router';
import { RouteEnum } from '../../constants/route-enum';
import { Filter, FilterStorageService } from '../../services/filter-storage.service';
import { RoutesReducerInterface } from '../../stores/routes/route.reducer';
import { ESTADOS } from '../../constants/estados-constant';
import { ChatListType } from '../../constants/chat-list-type';

type FilterFunction = {
    (data: ParliamentarianDataResponse[]): ParliamentarianDataResponse[]
};


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
    @Input() loading: boolean = false
    conversations: ParliamentarianDataResponse[];
    laws: any[];
    listSize = 20;
    RadioFilterEnum = RadioFilterEnum;
    selectedSwitchFilterEnum: SwitchFilterEnum = SwitchFilterEnum.POLITICIANS;
    selectedRadioChamberEnum = true;
    selectedRadioSenateEnum = true;
    fromBestToWorst = true;
    selectedState = '';
    filter: Filter
    selectedRoute: RouteEnum;
    states = ESTADOS;
    chatListType: ChatListType;


    CHAT_LIST_TYPE = ChatListType;

    filterFunctions: FilterFunction[] = [
        this.filterByState(),
        this.filterByPosition(),
        this.filterBySearchText(),
    ];
    filterLawFunctions: FilterFunction[] = [
        this.filterLawByPosition(),
        this.filterLawBySearchText(),
    ];

    constructor(private politicosService: PoliticosService,
                private router: Router,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface, route: RoutesReducerInterface }>,
                private filterStorageService: FilterStorageService) {

        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversations = parliamentarians.list;
            this.laws = parliamentarians.lawList;
            this.chatListType = parliamentarians.chatListType;
        });

        store.select('route').subscribe(route => {
            this.selectedRoute = route.selectedRoute;
        });

        this.filter = this.filterStorageService.userFilters;
    }

    get filteredConversations(): ParliamentarianDataResponse[] {
        let list = [...this.conversations];

        if (!this.filter.fromBestToWorse) list.reverse();

        this.filterFunctions.forEach((filter: FilterFunction) => {
            list = filter(list);
        });

        return list;
    }

    get filteredLaws(): any[] {
        let list = [...this.laws];

        this.filterLawFunctions.forEach((filter: FilterFunction) => {
            list = filter(list);
        });

        return list;
    }

    filterBySearchText(): FilterFunction {

        return (list: ParliamentarianDataResponse[]): ParliamentarianDataResponse[] => {

            if (!this.filter.searchText) return list?.slice(0, this.listSize);

            return list.filter((data) => {
                return (
                    data.parliamentarian.name
                        .toLowerCase()
                        .includes(this.filter.searchText.toLowerCase()) ||
                    data.parliamentarian.nickname
                        .toLowerCase()
                        .includes(this.filter.searchText.toLowerCase())
                );
            });
        };
    }

    filterLawBySearchText(): FilterFunction {

        return (list: any[]): any[] => {

            if (!this.filter.searchText) return list?.slice(0, this.listSize);

            return list.filter((data) => {
                console.log("DAATa", data, this.filter);
                return (
                    data.myRankingTitle
                        ?.toLowerCase()
                        .includes(this.filter.searchText.toLowerCase()) ||
                    data.myRankingTitle
                        ?.toLowerCase()
                        .includes(this.filter.searchText.toLowerCase())
                );
            });
        };
    }

    filterByPosition(): FilterFunction {

        return (list: ParliamentarianDataResponse[]): ParliamentarianDataResponse[] => {

            if (this.filter.chamber && this.filter.senate) return list;

            if (this.filter.chamber) return list.filter(data => {
                return data.parliamentarian.position === 'Deputado Federal';
            });

            if (this.filter.senate) return list.filter(data => {
                return data.parliamentarian.position === 'Senador';
            });

            return list;
        }
    }

    filterLawByPosition(): FilterFunction {

        return (list: any[]): any[] => {

            if (this.filter.chamber && this.filter.senate) return list;

            if (this.filter.chamber) return list.filter(data => {
                return data.house === 'Câmara';
            });

            if (this.filter.senate) return list.filter(data => {
                return data.house === 'Senado';
            });

            return list;
        }
    }

    filterByState(): FilterFunction {

        return (list: ParliamentarianDataResponse[]): ParliamentarianDataResponse[] => {

            if (!this.filter.state) return list;

            return list.filter(data => {
                return data.parliamentarian.state.prefix === this.filter.state;
            });
        }
    }

    handleConversationClicked(conversation: ParliamentarianDataResponse): void {
        this.conversationClicked.emit();
        this.router.navigate([`/${this.selectedRoute}`],
            {
                queryParams: {id: conversation.parliamentarianId}
            });
        this.politicosService.getParliamentarianVotesById(conversation.parliamentarianId)
            .subscribe((conversationResponse: ParliamentarianDataResponse) => {
                this.store.dispatch(setCurrentConversation({currentConversation: conversationResponse}));
            });
    }

    handleLawClicked(law: any): void {
        this.conversationClicked.emit();
        this.router.navigate([`/${RouteEnum.LAW_VOTES}`],
            {
                queryParams: {lawId: law.id}
            });
        this.politicosService.getLawVotesById(law.id)
            .subscribe((lawResponse: any) => {
                const currentLaw = {
                    law: law,
                    lawVoteList: lawResponse.data
                }
                this.store.dispatch(setCurrentLaw({currentLaw: currentLaw}));
            });
    }

    onScroll(): void {
        this.listSize += 10;
    }

    selectSwitchFilter(switchFilterEnum: SwitchFilterEnum): void {
        this.selectedSwitchFilterEnum = switchFilterEnum;
    }

    selectRadioFilter(radioFilterEnum: RadioFilterEnum): void {
        if (radioFilterEnum === RadioFilterEnum.SENATE && this.filter.chamber) {
            this.filter.senate = !this.filter.senate;
        }

        if (radioFilterEnum === RadioFilterEnum.CHAMBER && this.filter.senate) {
            this.filter.chamber = !this.filter.chamber;
        }
        this.filterStorageService.setUserFilters(this.filter);
    }

    changeBestWorst(): void {
        this.filter.fromBestToWorse = !this.filter.fromBestToWorse;
        this.filterStorageService.setUserFilters(this.filter);
    }

    onChangeSearchText(): void {
        this.filterStorageService.setUserFilters(this.filter);

    }

    onChangeState(): void {
        this.filterStorageService.setUserFilters(this.filter);
        if (this.chatListType === ChatListType.LAW) {
            this.router.navigate([`/${RouteEnum.LAW_VOTES}`], {
                queryParams: {s: this.filter.state},
                queryParamsHandling: 'merge'
            });
        }
    }

    clearSearchText(): void {
        this.filter.searchText = '';
        this.onChangeSearchText();
    }

    changeListType(): void {
        if (this.chatListType === ChatListType.VOTE) {
            this.store.dispatch(setChatListType({chatListType: ChatListType.LAW}));
        } else {
            this.store.dispatch(setChatListType({chatListType: ChatListType.VOTE}));
        }
    }

    getProgressBar(resumes) {

        let total = 0

        resumes.forEach(resume => {
            total += resume.count
        })

        const newResumes = resumes.map(resume => {

            let color;
            let vote;
            const percent = Math.round(100 * resume.count / total);


            switch (resume.lawStatusId) {
                case 1:
                    color = 'green';
                    vote = 'Sim';
                    break;
                case 2:
                    color = 'red';
                    vote = 'Não';
                    break;
                default:
                    color = 'orange';
                    vote = 'Não Votou'
            }


            return {...resume, percent: percent ? percent : 1, color, vote, total}
        })
        if (newResumes.length > 3) {
            return [...newResumes.filter(resume => resume.color != 'orange'),
                ...this.returnNoVotes(newResumes.filter((resume) => resume.color === 'orange'))]
        }
        return newResumes
    }

    returnNoVotes(newResumes): any[] {
        let percent = 0
        newResumes.map(resume => percent = percent + resume.percent)
        return [{...newResumes[0], percent}]
    }
}
