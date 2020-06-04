import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChargeComponent } from './charge/charge.component';
import { TollComponent } from './toll/toll.component';
import { TollListComponent } from './toll-list/toll-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/toll', pathMatch: 'full' },
    { path: 'charge', component: ChargeComponent },
    { path: 'toll', component: TollComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
