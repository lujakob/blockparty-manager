import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IAirdrop } from '../airdrop.interface';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { User } from '../../user/user';
import {AirdropDialogComponent} from '../airdrop-dialog/airdrop-dialog.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';

@Component({
  selector: 'app-airdrop-detail',
  templateUrl: './airdrop-detail.component.html',
  styleUrls: ['./airdrop-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropDetailComponent implements OnInit {

  public airdrop: any;
  public referrals: any[];
  public user: User;
  private id: string;
  public blockedByOtherUser: boolean = false;
  public blockedByMe: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.auth.user.subscribe((user: User) => this.user = user);

    this.route.paramMap
      .map((params: ParamMap) => params.get('id') || '')
      .subscribe(id => {
        this.id = id;

        Observable.combineLatest(
          this.firestoreService.col$(
            `airdrops/${id}/referrals`,
            ref => ref.orderBy('createdAt', 'desc')
          ),
          this.firestoreService.doc$(`airdrops/${id}`)
        )
        .subscribe(([referrals, airdrop]) => {
          this.referrals = referrals;
          this.airdrop = airdrop;
          this.blockedByOtherUser = !!this.airdrop.holder && this.airdrop.holder.id !== this.user.uid;
          this.blockedByMe = !!this.airdrop.holder && this.airdrop.holder.id === this.user.uid;
        });
      });

  }

  isBlockedBy() {
    if (this.airdrop.holder && this.airdrop.holder.username) {
      const now = new moment();
      const created = new moment(this.airdrop.holder.created);
      const duration = Math.ceil(moment.duration(now.diff(created)).asMinutes());

      return this.airdrop.holder.username + ` (${duration} mins)`;
    } else {
      return '';
    }
  }


  onClick(airdrop) {

    const dialogRef = this.dialog.open(AirdropDialogComponent, {
      width: '300px',
      data: {airdrop, user: this.user, id: this.id}
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
