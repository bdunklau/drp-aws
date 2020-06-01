import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargeComponent } from './charge/charge.component';
import { TollComponent } from './toll/toll.component';
import { TollListComponent } from './toll-list/toll-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/toll', pathMatch: 'full' },
    { path: 'toll', component: TollComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
