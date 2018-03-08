import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router } from '@angular/router';
import { IAirdropItem } from '../airdrop.interface';
import 'rxjs/add/operator/switchMap';
import { MatDialog } from '@angular/material';
import { AirdropDialogComponent } from '../airdrop-dialog/airdrop-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';

@Component({
  selector: 'app-airdrop-list',
  templateUrl: './airdrop-list.component.html',
  styleUrls: ['./airdrop-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropListComponent implements OnInit {

  private user: User;

  public displayedColumns = ['title', 'creator'];
  public dataSource: IAirdropItem[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.user.subscribe((user: User) => this.user = user);

    this.firestoreService
      .colWithIds$('airdrops', ref => ref.orderBy('createdAt', 'asc'))
      .subscribe(data => {
        this.dataSource = this.addUserIsHolder(data);
      });
  }

  addUserIsHolder(data) {
    return data.map(item => {
      item = Object.assign(item, {userIsHolder: !!item.holder && this.user.uid === item.holder.id});
      return item;
    });
  }

  onClick(airdrop) {
    console.log(airdrop);
    const dialogRef = this.dialog.open(AirdropDialogComponent, {
      width: '300px',
      data: {airdrop, user: this.user}
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });

    // this.router.navigate(['inventory', row.id])
  }

}
