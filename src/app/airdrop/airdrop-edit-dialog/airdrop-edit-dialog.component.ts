import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore.service';
import { IAirdropEditDialogData} from '../airdrop.interface';

@Component({
  selector: 'app-airdrop-edit-dialog',
  templateUrl: './airdrop-edit-dialog.component.html',
  styleUrls: ['./airdrop-edit-dialog.component.css']
})
export class AirdropEditDialogComponent implements OnInit {

  public form: FormGroup;
  public userIsHolder: boolean = false;

  constructor(
      public dialogRef: MatDialogRef<AirdropEditDialogComponent>,
      public firestoreService: FirestoreService,
      private formBuilder: FormBuilder,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: IAirdropEditDialogData) {

    dialogRef.afterOpen().subscribe(() => {
      const { title, projectLink, description } = this.data.airdrop;
      this.form = this.formBuilder.group({
        title: [title, Validators.required],
        projectLink: [projectLink, Validators.required],
        description: [description],
      });

    });
  }

  ngOnInit() {}

  save() {
    const ref = `airdrops/${this.data.id}`;
    const data = this.form.value;
    this.firestoreService
      .update(ref, data)
      .then(() => {
        this.dialogRef.close();
      })
      .catch((e) => console.log(e));
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
