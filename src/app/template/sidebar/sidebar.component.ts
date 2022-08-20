import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { PoliticosService } from '../../politicos/politicos.service';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';
import { SwitchFilterEnum } from '../../enums/switch-filter-enum';
import { RadioFilterEnum } from '../../enums/radio-filter-enum';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../stores/parliamentarians/parliamentarians.reducer';
import { setCurrentConversation } from '../../stores/parliamentarians/parliamentarians.actions';
import { Router } from '@angular/router';
import { RouteEnum } from '../../enums/route-enum';
import { routesReducerInterface } from '../../stores/routes/route.reducer';
import { Filter, FilterStorageService } from '../../services/filter-storage.service';

type FilterFunction = {
    (data: ParliamentarianDataResponse[]): ParliamentarianDataResponse[]
}


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
    conversations: ParliamentarianDataResponse[];
    listSize = 20;
    SwitchFilterEnum = SwitchFilterEnum;
    RadioFilterEnum = RadioFilterEnum;
    selectedSwitchFilterEnum: SwitchFilterEnum = SwitchFilterEnum.POLITICIANS;
    filter: Filter
    selectedRoute: RouteEnum;
    states = [
        {
            "sigla": "AC",
            "nome": "Acre",
        },
        {
            "sigla": "AL",
            "nome": "Alagoas",
        },
        {
            "sigla": "AM",
            "nome": "Amazonas",
        },
        {
            "sigla": "AP",
            "nome": "Amapá",
        },
        {
            "sigla": "BA",
            "nome": "Bahia",
        },
        {
            "sigla": "CE",
            "nome": "Ceará",
        },
        {
            "sigla": "DF",
            "nome": "Distrito Federal",
        },
        {
            "sigla": "ES",
            "nome": "Espírito Santo",
        },
        {
            "sigla": "GO",
            "nome": "Goiás",
        },
        {
            "sigla": "MA",
            "nome": "Maranhão",
        },
        {
            "sigla": "MG",
            "nome": "Minas Gerais",
        },
        {
            "sigla": "MS",
            "nome": "Mato Grosso do Sul",
        },
        {
            "sigla": "MT",
            "nome": "Mato Grosso",
        },
        {
            "sigla": "PA",
            "nome": "Pará",
        },
        {
            "sigla": "PB",
            "nome": "Paraíba",
        },
        {
            "sigla": "PE",
            "nome": "Pernambuco",
        },
        {
            "sigla": "PI",
            "nome": "Piauí",
        },
        {
            "sigla": "PR",
            "nome": "Paraná",
        },
        {
            "sigla": "RJ",
            "nome": "Rio de Janeiro",
        },
        {
            "sigla": "RN",
            "nome": "Rio Grande do Norte",
        },
        {
            "sigla": "RO",
            "nome": "Rondônia",
        },
        {
            "sigla": "RR",
            "nome": "Roraima",
        },
        {
            "sigla": "RS",
            "nome": "Rio Grande do Sul",
        },
        {
            "sigla": "SC",
            "nome": "Santa Catarina",
        },
        {
            "sigla": "SE",
            "nome": "Sergipe",
        },
        {
            "sigla": "SP",
            "nome": "São Paulo",
        },
        {
            "sigla": "TO",
            "nome": "Tocantins",
        }
    ];

    filterFunctions: FilterFunction[] = [
        this.filterByState(),
        this.filterByPosition(),
        this.filterBySearchText(),
    ];

    constructor(private politicosService: PoliticosService,
                private router: Router,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface, route: routesReducerInterface }>,
                private filterStorageService: FilterStorageService) {

        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversations = parliamentarians.list;
        });
        store.select('route').subscribe(route => {
            this.selectedRoute = route.selectedRoute;
        });

        this.filter = this.filterStorageService.userFilters
    }

    ngOnInit(): void {
    }

    get filteredConversations(): ParliamentarianDataResponse[] {
        let list = [...this.conversations];

        if (!this.filter.fromBestToWorse) list.reverse();

        this.filterFunctions.forEach((filter: FilterFunction) => {
            list = filter(list);
        })

        return list
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
        }
    }

    filterByPosition(): FilterFunction {

        return (list: ParliamentarianDataResponse[]): ParliamentarianDataResponse[] => {

            if (this.filter.chamber && this.filter.state) return list

            if (this.filter.chamber) return list.filter(data => {
                return data.parliamentarian.position === 'Deputado Federal';
            })

            if (this.filter.state) return list.filter(data => {
                return data.parliamentarian.position === 'Senador';
            })

            return list
        }
    }

    filterByState(): FilterFunction {

        return (list: ParliamentarianDataResponse[]): ParliamentarianDataResponse[] => {

            if (!this.filter.state) return list

            return list.filter(data => {
                return data.parliamentarian.state.prefix === this.filter.state
            })
        }
    }

    handleConversationClicked(conversation: ParliamentarianDataResponse): void {
        this.politicosService.getParliamentarianVotesById(conversation.parliamentarianId)
            .subscribe((conversationResponse: ParliamentarianDataResponse) => {
                this.conversationClicked.emit();
                this.router.navigate([`/${this.selectedRoute}`],
                    {
                        queryParams: {id: conversationResponse.parliamentarianRanking.parliamentarianId}
                    });
                this.store.dispatch(setCurrentConversation({currentConversation: conversationResponse}));
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
        this.filterStorageService.setUserFilters(this.filter)
    }

    changeBestWorst(): void {
        this.filter.fromBestToWorse = !this.filter.fromBestToWorse;
        this.filterStorageService.setUserFilters(this.filter)
    }

    onChangeSearchText(): void {
        this.filterStorageService.setUserFilters(this.filter)

    }

    clearSearchText(): void {
        this.filter.searchText = ''
        this.onChangeSearchText();
    }
}
