import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IAirdrop, IReferral } from '../airdrop.interface';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { User } from '../../user/user';
import { AirdropDialogComponent } from '../airdrop-dialog/airdrop-dialog.component';
import { AirdropEditDialogComponent } from '../airdrop-edit-dialog/airdrop-edit-dialog.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import { getHolderSince } from '../utils';

@Component({
  selector: 'app-airdrop-detail',
  templateUrl: './airdrop-detail.component.html',
  styleUrls: ['./airdrop-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropDetailComponent implements OnInit {

  public airdrop: IAirdrop;
  public referrals: IReferral[];
  public user: User;
  private id: string;
  public blockedByOtherUser = false;
  public blockedByMe = false;

  constructor(
    private firestoreService: FirestoreService,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    Observable
      .combineLatest(
        this.auth.user,
        this.route.paramMap.map((params: ParamMap) => params.get('id') || '')
      )
      .switchMap(([user, id]) => {
        this.user = user;
        this.id = id;

        return Observable.combineLatest(
          this.firestoreService.col$(
            `airdrops/${id}/referrals`,
            ref => ref.orderBy('createdAt', 'desc')
          ),
          this.firestoreService.doc$(`airdrops/${id}`)
        );
      })
      .subscribe(([referrals, airdrop]: [IReferral[], IAirdrop]) => {
        this.referrals = referrals;
        this.airdrop = airdrop;
        this.blockedByOtherUser = !!this.airdrop.holder && this.airdrop.holder.id !== this.user.uid;
        this.blockedByMe = !!this.airdrop.holder && this.airdrop.holder.id === this.user.uid;
      });
  }

  isBlockedBy() {
    return getHolderSince(this.airdrop, this.user);
  }


  onClick(airdrop: IAirdrop) {

    const dialogRef = this.dialog.open(AirdropDialogComponent, {
      minWidth: '60%',
      data: {airdrop, user: this.user, id: this.id}
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }

  edit() {
    const dialogRef = this.dialog.open(AirdropEditDialogComponent, {
      minWidth: '60%',
      data: {airdrop: this.airdrop, id: this.id}
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }

  toggleStatus() {
    const active = !this.airdrop.active;
    const ref = `airdrops/${this.id}`;
    this.firestoreService.update(ref, {active});
  }

  backToList() {
    this.router.navigate(['airdrop/list']);
  }
}
