import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
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
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TollComponent,
    ChargeComponent,
    TollListComponent,
    PageNotFoundComponent,
    ChargeFormComponent,
    ChargeListComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // restores xsrf support
    //HttpClientXsrfModule,
    FormsModule
    , ReactiveFormsModule, FontAwesomeModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
