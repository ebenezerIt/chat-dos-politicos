import { Component, OnInit } from '@angular/core';
import { Processes } from '../../../politicos/ParlamentarianResponseDtos';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import { RoutesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../constants/route-enum';

@Component({
  selector: 'app-lawsuit',
  templateUrl: './lawsuit.component.html',
  styleUrls: ['./lawsuit.component.scss'],
})
export class LawsuitComponent implements OnInit {
  loading = true;
  processes: Processes[];

  constructor(
    public dialog: MatDialog,
    private store: Store<{
      parliamentarians: parliamentariansReducerInterface;
      route: RoutesReducerInterface;
    }>
  ) {
    store.select('parliamentarians').subscribe(parliamentarians => {
      this.processes =
        parliamentarians.currentConversation.parliamentarianRanking.parliamentarian.processes;
    });

    store.dispatch(setSelectedRoute({ route: RouteEnum.LAWSUIT }));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
