import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from './material.module';
import { FirestoreService } from './services/firestore.service';
import { UploadService } from './services/upload.service';
import { Ng2ImgToolsModule } from 'ng2-img-tools';

@NgModule({
  imports: [
    CommonModule,
    Ng2ImgToolsModule,
    MaterialModule
  ],
  providers: [FirestoreService, UploadService],
  declarations: [LoadingComponent],
  exports: [
    LoadingComponent,
    MaterialModule
  ]
})
export class SharedModule { }
