import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-toolbar-top',
  templateUrl: './toolbar-top.component.html',
  styleUrls: ['./toolbar-top.component.css']
})
export class ToolbarTopComponent implements OnInit {

  public showNavbar: boolean = true;
  public userName: string = '';
  public title: string = 'Hausverleih';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.user
      .do(user => this.userName = (user && user.displayName) ? user.displayName : '')
      .map(user => !!user)
      .subscribe(isLogged => this.showNavbar = isLogged)
  }

  onLogout() {
    this.auth.signOut()
  }
}
