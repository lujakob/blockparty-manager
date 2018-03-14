import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router } from '@angular/router';
import { IAirdrop } from '../airdrop.interface';
import 'rxjs/add/operator/switchMap';
import { MatDialog } from '@angular/material';
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
    this.router.navigate(['airdrop/detail', airdrop.id]);
  }

}
