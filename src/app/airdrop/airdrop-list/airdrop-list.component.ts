import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router } from '@angular/router';
import { IAirdrop } from '../airdrop.interface';
import 'rxjs/add/operator/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';
import { getHolderSince } from '../utils';

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
  private active$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit() {
    Observable.combineLatest(
      this.auth.user,
      this.active$
    ).switchMap(([user, active]: [User, boolean]) => {
      this.user = user;

      const queryFn = ref => ref.where('active', '==', active).orderBy('createdAt', 'desc');
      return this.firestoreService.colWithIds$('airdrops', queryFn);
    })
      .subscribe((data: IAirdrop[]) => {
        this.dataSource = this.transformData(data);
      });

  }

  transformData(data) {
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
    return getHolderSince(item, this.user, 'open');
  }

  onClick(airdrop) {
    this.router.navigate(['airdrop/detail', airdrop.id]);
  }

  toggleActive(active: any) {
    this.active$.next(active.value === 'true');
  }

}
