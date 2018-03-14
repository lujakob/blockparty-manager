import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';
import { AirdropCreateComponent } from './airdrop-create/airdrop-create.component';
import { AirdropDetailComponent } from './airdrop-detail/airdrop-detail.component';

const routes: Routes = [
  {
    path: 'list',
    pathMatch: 'full',
    component: AirdropListComponent
  },
  {
    path: 'detail/:id',
    component: AirdropDetailComponent
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
