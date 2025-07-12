import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteEnum } from '../constants/route-enum';
import { VotesComponent } from './chat/votes/votes.component';
import { ExpenditureComponent } from './chat/expenditure/expenditure.component';
import { LawsuitComponent } from './chat/lawsuit/lawsuit.component';
import { LawVotesComponent } from './chat/law-votes/law-votes.component';

const routes: Routes = [
  { path: RouteEnum.VOTES, component: VotesComponent },
  { path: RouteEnum.LAW_VOTES, component: LawVotesComponent },
  { path: RouteEnum.EXPENDITURE, component: ExpenditureComponent },
  { path: RouteEnum.LAWSUIT, component: LawsuitComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}
