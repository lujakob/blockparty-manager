import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: AirdropListComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirdropRoutingModule { }
