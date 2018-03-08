import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {FirestoreService} from '../../shared/services/firestore.service';
import {IAirdropHolder} from '../airdrop.interface';

@Component({
  selector: 'app-airdrop-dialog',
  templateUrl: './airdrop-dialog.component.html',
  styleUrls: ['./airdrop-dialog.component.css']
})
export class AirdropDialogComponent implements OnInit {

  public form: FormGroup;
  public userIsHolder: boolean = false;
  public view: string = 'OLD';

  constructor(
    public dialogRef: MatDialogRef<AirdropDialogComponent>,
    public firestoreService: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.afterOpen().subscribe(() => {
      this.form = new FormGroup({
        referralLink: new FormControl('', Validators.required)
      });

      this.firestoreService
        .doc$(`airdrops/${this.data.airdrop.id}`)
        .subscribe(airdrop => {
          this.data.airdrop = Object.assign(airdrop, {id: this.data.airdrop.id});

          this.userIsHolder = !!this.data.airdrop.holder && this.data.user.uid === this.data.airdrop.holder.id;

        });

    });
  }

  ngOnInit() {


  }

  onClaimAirdrop() {
    const data = {holder: this.buildCurrentHolder()};
    this.updateAirdrop(data);
  }

  onLiberateAirdrop() {
    const data = {holder: null};
    this.updateAirdrop(data, true);
  }

  onReferralSave() {

    const referral = this.form.get('referralLink').value;
    if (referral) {
      const data = {holder: null, update: new Date(), currentReferral: referral};
      this.updateAirdrop(data);


      const ref = `airdrops/${this.data.airdrop.id}/referrals`;
      this.firestoreService
        .add(ref, this.buildCurrentHolder())
        .then(() => {
          this.form.patchValue({referralLink: ''});
          this.dialogRef.close();
          console.log('referral updated');
        })
        .catch((e) => console.log(e));


    }

  }

  buildCurrentHolder(): IAirdropHolder {
    return {
      id: this.data.user.uid,
      username: this.data.user.displayName,
      created: new Date()
    };
  }

  updateAirdrop(data: {[key: string]: any}, closeDialog: boolean = false) {
    const ref = `airdrops/${this.data.airdrop.id}`;
    this.firestoreService
      .update(ref, data)
      .then(() => {
        console.log('updated');
        if (closeDialog) {
          this.dialogRef.close();
        }
      })
      .catch((e) => console.log(e));
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
