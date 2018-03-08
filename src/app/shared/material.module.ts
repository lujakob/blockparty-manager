import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatDividerModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTableModule,
  MatProgressBarModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatStepperModule
} from '@angular/material';


@NgModule({
  imports: [CommonModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatStepperModule
  ]
})
export class MaterialModule {
}
