import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../../components/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { ParliamentarianDataResponse } from '../../../politicos/ParlamentarianResponseDtos';
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
      this.conversation = parliamentarians.currentConversation
    })
  }

  ngOnInit(): void {
  }


  openDialog(law: any) {
    console.log("law", law)
    this.dialog.open(DialogComponent, {
      data: {
        message: law.description,
        title: law.number,
      },
    });
  }


}
