import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MatSnackBarModule } from '@angular/material';
import {SharedModule} from "../shared/shared.module";

@NgModule({
	imports: [
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
		AngularFirestoreModule,
    MatSnackBarModule,
    SharedModule
	],
	declarations: [],
	providers: [
		AuthService,
		AuthGuard
	]
})
export class AuthModule { }
