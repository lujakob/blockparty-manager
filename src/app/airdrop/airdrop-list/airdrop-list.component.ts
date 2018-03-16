import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router } from '@angular/router';
import { IAirdrop } from '../airdrop.interface';
import 'rxjs/add/operator/switchMap';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';
import * as moment from 'moment';

@Component({
  selector: 'app-airdrop-list',
  templateUrl: './airdrop-list.component.html',
  styleUrls: ['./airdrop-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropListComponent implements OnInit {

  private user: User;

  public displayedColumns = ['title', 'creator', 'state'];
  public dataSource: IAirdrop[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.user
      .switchMap((user: User) => {
        this.user = user;
        return this.firestoreService.colWithIds$(
          'airdrops',
          ref => ref.orderBy('createdAt', 'desc')
        );
      })
      .subscribe((data: IAirdrop[]) => {
        this.dataSource = this.transformData(data);
      });

  }

  transformData(data) {
    console.log(data);
    return data.map(item => {
      item = Object.assign(item, {
        userIsHolder: this.userIsHolder(item),
        state: this.itemState(item)
      });
      return item;
    });
  }

  userIsHolder(item) {
    return !!item.holder && this.user.uid === item.holder.id;
  }

  itemState(item) {
    if (item.holder && item.holder.username) {
      const now = new moment();
      const created = new moment(item.holder.created);
      const duration = Math.ceil(moment.duration(now.diff(created)).asMinutes());

      return item.holder.username + ` (${duration} mins)`;
    }

    return 'open';
  }

  onClick(airdrop) {
    this.router.navigate(['airdrop/detail', airdrop.id]);
  }

}
