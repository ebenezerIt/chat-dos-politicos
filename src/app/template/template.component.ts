import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticosService } from '../politicos/politicos.service';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../stores/parliamentarians.reducer';
import { Subscription } from 'rxjs';
import { setCurrentConversation } from '../stores/parliamentarians.actions';
import { RouteEnum } from '../enums/route-enum';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
    conversation;
    showChat = false;
    paramsSubscription: Subscription;
    openChat = true;
    RouteEnum = RouteEnum;
    public currentWindowWidth: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private politicosService: PoliticosService,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface }>) {
        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversation = parliamentarians.currentConversation
        })
    }

    ngOnInit() {
        this.currentWindowWidth = window.innerWidth;

        this.paramsSubscription = this.route.queryParams.subscribe((params) => {
            if (params.id) {
                this.politicosService.getParliamentarianVotesById(params.id).subscribe((conversation) => {
                    this.store.dispatch(setCurrentConversation({currentConversation: conversation}))
                    this.changeShowChat()
                    this.paramsSubscription.unsubscribe()
                })
            }
        })
    }

    onConversationSelected(): void {
        this.changeShowChat()
        this.paramsSubscription.unsubscribe()
    }

    changeShowChat() {
        this.showChat = !this.showChat;
    }

    onClickBack() {
        this.router.navigate(['/'], {queryParams: {}})
        this.changeShowChat()
    }

    selectSwitchChat(routeEnum: RouteEnum): void {
        this.router.navigate([`/${routeEnum}`], {queryParamsHandling: "preserve"})
    }

}
