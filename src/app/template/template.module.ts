import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../components/dialog-component/dialog-component.component';
import { ExpenditureComponent } from './chat/expenditure/expenditure.component';
import { VotesComponent } from './chat/votes/votes.component';
import { LawsuitComponent } from './chat/lawsuit/lawsuit.component';
import { TemplateComponent } from './template.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { TemplateRoutingModule } from './template-routing.module';
import { IntroComponent } from '../components/intro/intro.component';
import { FilterStorageService } from '../services/filter-storage.service';
import { StoryComponent } from '../components/story-component/story-component.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonUserListComponent } from '../components/skeleton-user-list/skeleton-user-list.component';

@NgModule({
    declarations: [
        TemplateComponent,
        SidebarComponent,
        ChatComponent,
        DialogComponent,
        ExpenditureComponent,
        VotesComponent,
        LawsuitComponent,
        IntroComponent,
        StoryComponent,
        SkeletonUserListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PickerModule,
        FlexLayoutModule,
        InfiniteScrollModule,
        MatDialogModule,
        MatButtonModule,
        TemplateRoutingModule,
        NgxSkeletonLoaderModule,
        MatIconModule
    ],
    providers: [
        FilterStorageService

    ]
})
export class TemplateModule {
}
