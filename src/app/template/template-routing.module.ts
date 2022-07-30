import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteEnum } from '../enums/route-enum';
import { VotesComponent } from './chat/votes/votes.component';
import { SpendingComponent } from './chat/spending/spending.component';
import { LawsuitComponent } from './chat/lawsuit/lawsuit.component';

const routes: Routes = [
      {path: RouteEnum.Votes, component: VotesComponent},
      {path: RouteEnum.Spending, component: SpendingComponent},
      {path: RouteEnum.Lawsuit, component: LawsuitComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
