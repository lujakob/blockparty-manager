import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';
import { AirdropCreateComponent } from './airdrop-create/airdrop-create.component';

const routes: Routes = [
  {
    path: 'list',
    component: AirdropListComponent
  },
  {
    path: 'create',
    component: AirdropCreateComponent
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
