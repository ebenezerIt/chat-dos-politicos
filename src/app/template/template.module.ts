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
import { SkeletonMessageListComponent } from '../components/skeleton-message-list/skeleton-message-list.component';
import { ShareButtonComponent } from '../components/share-button/share-button.component';
import { LawVotesComponent } from './chat/law-votes/law-votes.component';
import { VoiceButtonComponent } from '../components/voice-button/voice-button.component';
import { ContatosDialogComponent } from '../components/contatos-dialog/contatos-dialog.component';


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
        SkeletonUserListComponent,
        SkeletonMessageListComponent,
        ShareButtonComponent,
        VoiceButtonComponent,
        LawVotesComponent,
        ContatosDialogComponent
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
    ],
    entryComponents: [
        DialogComponent
    ]
})
export class TemplateModule {
}
