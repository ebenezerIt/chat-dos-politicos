import { Component, OnDestroy } from '@angular/core';
import { DialogComponent } from '../../../components/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import {
  LawVote,
  ParliamentarianDataResponse,
} from '../../../politicos/ParlamentarianResponseDtos';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import { RoutesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../constants/route-enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss'],
})
export class VotesComponent implements OnDestroy {
  conversation: ParliamentarianDataResponse | null = null;
  sortedVotes: LawVote[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private store: Store<{
      parliamentarians: parliamentariansReducerInterface;
      route: RoutesReducerInterface;
    }>
  ) {
    store
      .select('parliamentarians')
      .pipe(takeUntil(this.destroy$))
      .subscribe(parliamentarians => {
        this.conversation = parliamentarians.currentConversation;
        this.updateSortedVotes();
      });

    store.dispatch(setSelectedRoute({ route: RouteEnum.VOTES }));
  }

  openDialog(law: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        message: law.description,
        title: law.myRankingTitle || law.number,
      },
    });
  }

  trackByLawVote(_index: number, vote: LawVote): string | number {
    return vote?.law?.id ?? vote?.law?.number ?? _index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSortedVotes(): void {
    const lawVotes =
      this.conversation?.parliamentarianRanking?.parliamentarian?.lawVotes;

    if (!lawVotes || !lawVotes.length) {
      this.sortedVotes = [];
      return;
    }

    this.sortedVotes = [...lawVotes].sort((vote1, vote2) => {
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
