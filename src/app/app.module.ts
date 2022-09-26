import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { parliamentariansReducer } from './stores/parliamentarians/parliamentarians.reducer';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { routeReducer } from './stores/routes/route.reducer';
import { MatDialogModule } from '@angular/material/dialog';
registerLocaleData(localePt)


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        StoreModule.forRoot({parliamentarians: parliamentariansReducer, route: routeReducer})
    ],
    providers: [{
        provide: LOCALE_ID,
        useValue: "pt-BR"
    }],    bootstrap: [AppComponent],
})
export class AppModule {
}
