import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../../components/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import {LawVote, ParliamentarianDataResponse} from '../../../politicos/ParlamentarianResponseDtos';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians.reducer';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {
  conversation: ParliamentarianDataResponse;

  constructor(public dialog: MatDialog,
              private store: Store<{ parliamentarians: parliamentariansReducerInterface }>) {

    store.select('parliamentarians').subscribe(parliamentarians => {
      this.conversation = parliamentarians.currentConversation;
    });
  }

  ngOnInit(): void {
  }

  openDialog(law: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        message: law.description,
        title: law.number,
      },
    });
  }

  getSortedVotes(conversation: ParliamentarianDataResponse): LawVote[] {
    const sortedVotes = [...this.conversation.parliamentarianRanking.parliamentarian.lawVotes];
    return sortedVotes
        .sort((vote1, vote2) => {
          if (vote1.law.dateVoting > vote2.law.dateVoting) {
            return 1;
          }
          if (vote1.law.dateVoting < vote2.law.dateVoting) {
            return -1;
          }
          return 0;
        });
  }
}
