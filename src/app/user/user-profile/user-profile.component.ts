import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {FirestoreService} from '../../shared/services/firestore.service';
import {AuthService} from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../user/user';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {

  public user: User;
  public requests = [];
  public assets = [];
  public requestsColumns = ['inventoryTitle'];
  public assetsColumns = ['title', 'holder', 'delete'];

  constructor(
    private firestoreService: FirestoreService,
    private auth: AuthService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.auth.user
      .subscribe((user: User) => {
        this.user = user;

        //this.loadMyAirdrops(user);

      });

  }


  /**
   * load current users airdrops
   * @param {User} user
   */
  loadMyAirdrops(user: User) {
    if (!user) {
      return;
    };

    const ref = `airdrops`;
    this.firestoreService
      .colWithIds$(ref, (queryFn) => queryFn.where('owner.id', '==', user.uid))
      .subscribe(data => this.assets = data);
  }

  switchContent(event) {
    // console.log(event);
  }

  onClick(row) {
    this.router.navigate(['inventory', row.id]);
  }


}

