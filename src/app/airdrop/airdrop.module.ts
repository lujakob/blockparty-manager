import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirdropRoutingModule } from './airdrop-routing.module';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';

@NgModule({
  imports: [
    CommonModule,
    AirdropRoutingModule
  ],
  declarations: [AirdropListComponent]
})
export class AirdropModule { }
