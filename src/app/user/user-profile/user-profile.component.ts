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

  private user: User;
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

        this.loadRequests(user);
        this.loadMyAssets(user);

      });

  }

  loadRequests(user: User) {
    if (!user) return;

    const ref = `users/${user.uid}/pending-requests`;
    this.firestoreService
      .colWithIds$(ref, ref => ref.orderBy('createdAt', 'desc'))
      .subscribe(data => {
        this.requests = data;
      });
  }

  /**
   * load current users assets
   * @param {User} user
   */
  loadMyAssets(user: User) {
    if (!user) return;

    const ref = `inventory`;
    this.firestoreService
      .colWithIds$(ref, ref => ref.where('owner.id', '==', user.uid))
      .subscribe(data => this.assets = data);
  }

  switchContent(event) {
    // console.log(event);
  }

  onClick(row) {
    this.router.navigate(['inventory', row.id])
  }

  delete(row) {
    if (this.isDisabled(row)) {
      this.snackBar.open('Das Asset kann nicht gelöscht werden, weil es verliehen ist.', null,{
        duration: 3000,
      });
    } else {
      let dialogRef = this.dialog.open(DeleteAssetDialog, {
        width: '250px',
        data: { row }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.doDelete(row);
        }
      });

    }
  }

  doDelete(row) {

    // delete requests subcollection of this asset document
    const requestsRef = `inventory/${row.id}/requests`;
    this.firestoreService.deleteCollection(requestsRef, 10).subscribe();

    // delete pending-requests collection of the owner document
    const pendingRequestRef = `users/${this.user.uid}/pending-requests/${row.id}`;
    this.firestoreService
      .delete(pendingRequestRef)
      .catch(e => console.log(e));

    // delete inventory document itself
    const assetRef = `inventory/${row.id}`;
    this.firestoreService
      .delete(assetRef)
      .then(() => {
        this.snackBar.open('Das Asset wurde erfolgreich gelöscht.', null,{
          duration: 3000,
        });
      })
      .catch(e => console.log(e));

  }

  isDisabled({holder, owner}) {
    return holder.id !== owner.id;
  }
}

@Component({
  selector: 'asset-delete-dialog',
  template: `
		<h1 mat-dialog-title>Asset löschen?</h1>
		<div mat-dialog-content>
			<p>{{data.row.category.title}} - {{data.row.title}}<br> wirklich löschen?</p>
		</div>
		<div mat-dialog-actions>
			<button mat-button (click)="onNoClick()">No Thanks</button>
			<button mat-button [mat-dialog-close]="true" cdkFocusInitial>Ok</button>
		</div>
  `,
})
export class DeleteAssetDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteAssetDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
