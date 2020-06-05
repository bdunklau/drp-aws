import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TollComponent } from './toll/toll.component';
import { ChargeComponent } from './charge/charge.component';
import { TollListComponent } from './toll-list/toll-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChargeFormComponent } from './charge-form/charge-form.component';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    TollComponent,
    ChargeComponent,
    TollListComponent,
    PageNotFoundComponent,
    ChargeFormComponent,
    ChargeListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    , ReactiveFormsModule, FontAwesomeModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
