import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore.service';
import {IAirdrop, IAirdropHolder} from '../airdrop.interface';

@Component({
  selector: 'app-airdrop-edit-dialog',
  templateUrl: './airdrop-edit-dialog.component.html',
  styleUrls: ['./airdrop-edit-dialog.component.css']
})
export class AirdropEditDialogComponent implements OnInit {

  public form: FormGroup;
  public userIsHolder: boolean = false;
  public view: string = 'OLD';

  constructor(
      public dialogRef: MatDialogRef<AirdropEditDialogComponent>,
      public firestoreService: FirestoreService,
      private formBuilder: FormBuilder,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: {airdrop: IAirdrop, id: string}) {

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
    console.log(data);
    this.firestoreService
      .update(ref, data)
      .then(() => {
        console.log('updated');
        this.dialogRef.close();
      })
      .catch((e) => console.log(e));
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
