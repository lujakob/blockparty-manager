import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Route[] = [
  {
    path: 'airdrop',
    loadChildren: 'app/airdrop/airdrop.module#AirdropModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: 'app/user/user.module#UserModule'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'airdrop'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
