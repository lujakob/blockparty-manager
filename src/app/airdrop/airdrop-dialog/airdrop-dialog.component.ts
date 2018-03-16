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
        .doc$(`airdrops/${this.data.id}`)
        .subscribe(airdrop => {
          this.data.airdrop = Object.assign(airdrop, {id: this.data.id});
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

    const oldReferralLink = this.data.airdrop.currentReferral;

    const referral = this.form.get('referralLink').value;
    if (referral) {
      const airdropData = {holder: null, currentReferral: referral};
      this.updateAirdrop(airdropData);


      const ref = `airdrops/${this.data.airdrop.id}/referrals`;
      const referralData = {
        user: this.buildCurrentHolder(),
        referral: oldReferralLink
      };
      this.firestoreService
        .add(ref, referralData)
        .then(() => {
          this.form.patchValue({referralLink: ''});
          this.dialogRef.close();
          console.log('referral saved', referralData);
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
