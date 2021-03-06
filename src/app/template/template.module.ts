import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../components/dialog-component/dialog-component.component';
import { SpendingComponent } from './chat/spending/spending.component';
import { VotesComponent } from './chat/votes/votes.component';
import { LawsuitComponent } from './chat/lawsuit/lawsuit.component';
import { TemplateComponent } from './template.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { TemplateRoutingModule } from './template-routing.module';

@NgModule({
    declarations: [
        SidebarComponent,
        ChatComponent,
        DialogComponent,
        SpendingComponent,
        VotesComponent,
        LawsuitComponent,
        TemplateComponent],
    imports: [
        CommonModule,
        FormsModule,
        PickerModule,
        FlexLayoutModule,
        InfiniteScrollModule,
        MatDialogModule,
        MatButtonModule,
        TemplateRoutingModule,
    ],
})
export class TemplateModule {
}
