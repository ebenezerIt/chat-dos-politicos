import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticosService } from '../politicos/politicos.service';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../stores/parliamentarians/parliamentarians.reducer';
import { Subscription } from 'rxjs';
import { setCurrentConversation } from '../stores/parliamentarians/parliamentarians.actions';
import { StorageEnum } from '../enums/storage-enum';
import { RouteEnum } from '../constants/route-enum';

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
    welcomeIntro = true
    RouteEnum = RouteEnum;
    public currentWindowWidth: number;
    loading = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private politicosService: PoliticosService,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface }>) {
        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversation = parliamentarians.currentConversation;
        });

        if (JSON.parse(localStorage.getItem(StorageEnum.WELCOME_INTRO))) this.welcomeIntro = false
    }

    ngOnInit(): void {
        this.currentWindowWidth = window.innerWidth;

        this.paramsSubscription = this.route.queryParams.subscribe((params) => {
            if (params.id) {
                this.loading = true;
                this.politicosService.getParliamentarianVotesById(params.id).subscribe((conversation) => {
                    this.store.dispatch(setCurrentConversation({currentConversation: conversation}));
                    this.changeShowChat();
                    this.paramsSubscription.unsubscribe();
                    this.loading = false
                });
            }
        });
    }

    onConversationSelected(): void {
        this.changeShowChat();
        this.paramsSubscription?.unsubscribe();
    }

    changeShowChat(): void {
        this.showChat = !this.showChat;
    }

    onClickBack(): void {
        this.router.navigate(['/'], {queryParams: {}});
        this.changeShowChat();
    }

    selectSwitchChat(routeEnum: RouteEnum): void {
        this.router.navigate([`/${routeEnum}`], {queryParamsHandling: 'preserve'});
    }
}
