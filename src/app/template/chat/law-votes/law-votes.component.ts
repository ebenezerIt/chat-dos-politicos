import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import { Subscription } from 'rxjs';
import { LawVoteType } from '../../../constants/law-vote-type';
import { RouteEnum } from '../../../constants/route-enum';
import { setCurrentConversation } from '../../../stores/parliamentarians/parliamentarians.actions';
import { ParliamentarianDataResponse } from '../../../politicos/ParlamentarianResponseDtos';
import { PoliticosService } from '../../../politicos/politicos.service';

@Component({
    selector: 'app-law-votes',
    templateUrl: './law-votes.component.html',
    styleUrls: ['./law-votes.component.scss']
})
export class LawVotesComponent implements OnInit {
    paramsSubscription: Subscription;
    currentLaw;
    vt;

    constructor(private route: ActivatedRoute,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface }>,
                private router: Router,
                private politicosService: PoliticosService) {

        this.store.select('parliamentarians').subscribe(parliamentarians => {
            this.currentLaw = parliamentarians.currentLaw;
        });


    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.vt) {
                this.vt = parseInt(params.vt);
            }
        })
    }

    get filteredLawVotes(): any[] {
        let list = [...this.currentLaw.lawVoteList];

        if (!this.vt) {
            return list;
        }

        if (this.vt === LawVoteType.SIM) {
            return list.filter(law => {
                return law.lawStatus.id === LawVoteType.SIM
            });
        } else if (this.vt === LawVoteType.NAO) {
            return list.filter(law => {
                return law.lawStatus.id === LawVoteType.NAO
            });

        } else {
            return list.filter(law => {
                return law.lawStatus.id !== LawVoteType.NAO && law.lawStatus.id !== LawVoteType.SIM
            });
        }

    }

    handleParliamentarianClicked(parliamentarian) {
        this.politicosService.getParliamentarianVotesById(parliamentarian.id)
            .subscribe((conversationResponse: ParliamentarianDataResponse) => {
                this.store.dispatch(setCurrentConversation({currentConversation: conversationResponse}));
                this.router.navigate([`/${RouteEnum.VOTES}`],
                    {
                        queryParams: {id: parliamentarian.id}
                    });
            });
    }
}
