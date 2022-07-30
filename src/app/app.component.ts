import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticosService } from './politicos/politicos.service';
import {  ParliamentarianListResponse } from './politicos/ParlamentarianResponseDtos';
import {  setList } from './stores/parliamentarians.actions';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from './stores/parliamentarians.reducer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private route: ActivatedRoute,
                private router: Router,
                private politicosService: PoliticosService,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface }>) {

        this.politicosService.listParliamentarians()
            .subscribe((response: ParliamentarianListResponse) => {
                const resp = response.data
                resp.forEach(conversation => {
                    if (!conversation.parliamentarian.latestMessage) {
                        // get by id and enrich
                        conversation.parliamentarian.latestMessage = 'MPV 1085/2021 | Mudança nos Serviços de Cartórios';
                        conversation.parliamentarian.latestMessageTime = new Date();
                    }
                });
                store.dispatch(setList({list: resp}))
            });
    }

}
