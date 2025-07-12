import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PoliticosService } from './politicos/politicos.service';
import { ParliamentarianListResponse } from './politicos/ParlamentarianResponseDtos';
import {
  setLawList,
  setList,
} from './stores/parliamentarians/parliamentarians.actions';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from './stores/parliamentarians/parliamentarians.reducer';
import { filter } from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private politicosService: PoliticosService,
    private store: Store<{ parliamentarians: parliamentariansReducerInterface }>
  ) {
    this.politicosService
      .listParliamentarians()
      .subscribe((response: ParliamentarianListResponse) => {
        const resp = response.data;
        resp.forEach(conversation => {
          if (!conversation.parliamentarian.latestMessage) {
            // get by id and enrich
            conversation.parliamentarian.latestMessage = '...';
            conversation.parliamentarian.latestMessageTime = new Date();
          }
        });
        store.dispatch(setList({ list: resp }));
      });
    this.setUpAnalytics();

    this.politicosService.getLawList().subscribe(response => {
      const resp = response.data;
      store.dispatch(setLawList({ lawList: resp }));
    });
  }

  setUpAnalytics() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-H1W9SCH7FF', {
          page_path: event.urlAfterRedirects,
        });
      });
  }
}
