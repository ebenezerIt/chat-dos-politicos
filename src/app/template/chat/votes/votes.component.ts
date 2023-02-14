import { Component } from '@angular/core';
import { DialogComponent } from '../../../components/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { LawVote, ParliamentarianDataResponse } from '../../../politicos/ParlamentarianResponseDtos';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import { RoutesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../constants/route-enum';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent {
  conversation: ParliamentarianDataResponse;

  constructor(public dialog: MatDialog,
              private store: Store<{ parliamentarians: parliamentariansReducerInterface, route: RoutesReducerInterface }>) {

    store.select('parliamentarians').subscribe(parliamentarians => {
      this.conversation = parliamentarians.currentConversation;
    });

    store.dispatch(setSelectedRoute({route: RouteEnum.VOTES}));

  }

  openDialog(law: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        message: law.description,
        title: law.number,
      },
    });
  }

  getSortedVotes(): LawVote[] {
    const sortedVotes = [...this.conversation.parliamentarianRanking.parliamentarian.lawVotes];
    return sortedVotes
        .sort((vote1, vote2) => {
          if (vote1?.law?.dateVoting > vote2?.law?.dateVoting) {
            return 1;
          }
          if (vote1?.law?.dateVoting < vote2?.law?.dateVoting) {
            return -1;
          }
          return 0;
        });
  }

}
