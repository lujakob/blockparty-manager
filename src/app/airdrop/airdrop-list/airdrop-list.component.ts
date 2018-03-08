import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirestoreService } from "../../shared/services/firestore.service";
import { Router } from '@angular/router';
import { IAirdropItem } from '../airdrop.interface';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-airdrop-list',
  templateUrl: './airdrop-list.component.html',
  styleUrls: ['./airdrop-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirdropListComponent implements OnInit {

  public items: IAirdropItem[] = [];

  displayedColumns = ['title', 'creator'];
  dataSource = [];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.firestoreService
      .colWithIds$('airdrops', ref => ref.orderBy('createdAt', 'asc'))
      .subscribe(data => {
        this.dataSource = data;
      });
  }


  onClick(row) {
    // this.router.navigate(['inventory', row.id])
  }
}
