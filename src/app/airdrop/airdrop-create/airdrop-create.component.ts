import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';
import { Router } from '@angular/router';
import { IAirdropItem, IReferral } from '../airdrop.interface';

export enum AIRDROP_STATE {
  OPEN,
  BLOCKED,
  CLOSED
}

@Component({
  selector: 'app-airdrop-create',
  templateUrl: './airdrop-create.component.html',
  styleUrls: ['./airdrop-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropCreateComponent implements OnInit {

  private user: User;

  public itemForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    projectLink: new FormControl('', [Validators.required]),
    referralLink: new FormControl('', [Validators.required])
  });

  constructor(
    private auth: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.auth.user.subscribe((user: User) => this.user = user);
  }

  saveItem() {
    this.firestoreService
      .add('airdrops', this.buildAirdrop())
      .then( data => {
        const docId = data.id;

        this.firestoreService
          .add(`airdrops/${docId}/referrals`, this.buildReferral())
          .then( referral => {
            this.router.navigate(['airdrop']);
            this.snackBar.open('Neuer Airdrop gespeichert.', '', { duration: 2000 });

          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  buildAirdrop(): IAirdropItem {
    const values = this.itemForm;
    const user = {id: this.user.uid, username: this.user.displayName};

    return  {
      title: values.get('title').value,
      projectLink: values.get('projectLink').value,
      currentReferral: this.itemForm.get('referralLink').value,
      creator: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: AIRDROP_STATE.OPEN
    };
  }

  buildReferral(): IReferral {
    const user = {id: this.user.uid, username: this.user.displayName};

    return  {
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: AIRDROP_STATE.OPEN,
      link: this.itemForm.get('referralLink').value
    };
  }

  onBack() {
    this.router.navigate(['airdrop']);
  }
}