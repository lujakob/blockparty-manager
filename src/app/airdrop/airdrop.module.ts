import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirdropRoutingModule } from './airdrop-routing.module';
import { AirdropListComponent } from './airdrop-list/airdrop-list.component';
import { MaterialModule } from '../shared/material.module';
import { AirdropCreateComponent } from './airdrop-create/airdrop-create.component';
import { AirdropDialogComponent } from './airdrop-dialog/airdrop-dialog.component';
import { AirdropDetailComponent } from './airdrop-detail/airdrop-detail.component';
import { ClipboardModule } from 'ngx-clipboard';
import { AirdropEditDialogComponent } from './airdrop-edit-dialog/airdrop-edit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AirdropRoutingModule,
    ClipboardModule
  ],
  declarations: [AirdropListComponent, AirdropCreateComponent, AirdropDialogComponent, AirdropEditDialogComponent, AirdropDetailComponent],
  entryComponents: [AirdropDialogComponent, AirdropEditDialogComponent]
})
export class AirdropModule { }
