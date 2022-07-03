import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticosService } from './politicos/politicos.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    conversation;
    showChat = false;
    paramsSubscription: Subscription;
    openChat = true;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private politicosService: PoliticosService) {
    }

    ngOnInit() {
        this.paramsSubscription = this.route.queryParams.subscribe((params) => {
            if (params.id) {
                this.politicosService.getParliamentarianVotesById(params.id).subscribe((conversation) => {
                    this.conversation = conversation
                    this.changeShowChat()
                    this.paramsSubscription.unsubscribe()
                })
            }
        })
    }

    onConversationSelected(conversation): void {
        this.conversation = conversation;
        this.changeShowChat()
        this.paramsSubscription.unsubscribe()
        this.router.navigate(['/'], {queryParams: {id: conversation.parliamentarianRanking.parliamentarianId}})

    }

    changeShowChat() {
        this.showChat = !this.showChat;
    }

    onClickBack() {
        this.router.navigate(['/'], {queryParams: {}})
        this.changeShowChat()
    }
}
