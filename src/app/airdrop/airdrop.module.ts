import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirdropRoutingModule } from './airdrop-routing.module';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';
import { MaterialModule } from '../shared/material.module';
import { AirdropCreateComponent } from './airdrop-create/airdrop-create.component';
import { AirdropDialogComponent } from './airdrop-dialog/airdrop-dialog.component';
import { AirdropDetailComponent } from './airdrop-detail/airdrop-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AirdropRoutingModule
  ],
  declarations: [AirdropListComponent, AirdropCreateComponent, AirdropDialogComponent, AirdropDetailComponent],
  entryComponents: [AirdropDialogComponent]
})
export class AirdropModule { }
