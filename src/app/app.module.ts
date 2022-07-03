import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DialogComponent } from './components/dialog-component/dialog-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [AppComponent, SidebarComponent, ChatComponent, DialogComponent],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        FormsModule,
        PickerModule,
        HttpClientModule,
        FlexLayoutModule,
        InfiniteScrollModule,
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
