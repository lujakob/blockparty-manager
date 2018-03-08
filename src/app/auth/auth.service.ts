import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {User} from '../user/user';
import {FirestoreService} from '../shared/services/firestore.service';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private firestoreService: FirestoreService,
              private router: Router,
              private snackBar: MatSnackBar) {

    this.afAuth.auth.useDeviceLanguage();

    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.firestoreService.doc$(`users/${user.uid}`);
        } else {
          return Observable.of(null);
        }
      });
  }

  private updateUserData(user: User) {
    const ref = `users/${user.uid}`;

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };

    if (user.displayName) {
      data.displayName = user.displayName;
      data.photoURL = user.photoURL;
    }

    return this.firestoreService.upsert(ref, data);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(cred => {
        this.updateUserData(cred.user);
        this.router.navigate(['/']);
      })
      .catch(e => {
        console.log(e.code);
        if (e.code === 'auth/account-exists-with-different-credential') {
          alert('Der Account existiert mit anderen Credentials.');
        }
      });
  }

  isAuthorized(): boolean {
    return !!this.user;
  }

  registerUser(username: string, email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {

        this.afAuth.auth.currentUser
          .sendEmailVerification()
          .catch(e => console.log(e));

        this.afAuth.auth.currentUser
          .updateProfile({
            displayName: username,
            photoURL: null
          })
          .catch(e => console.log(e));

        const userData: User = {
          uid: cred.uid,
          email: cred.email,
          emailVerified: cred.emailVerified,
          displayName: username,
          photoURL: null
        };

        this.updateUserData(userData)
          .then(() => {
            this.router.navigate(['/']);
          })
          .catch((e) => console.log(e));
      })
      .catch(e => console.log(e));
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(cred => {
        const userData: User = {
          uid: cred.uid,
          email: cred.email,
          emailVerified: cred.emailVerified,
          displayName: cred.displayName,
          photoURL: null
        };

        this.updateUserData(userData);
        this.router.navigate(['/']);
      })
      .catch(e => {
        console.log(e);
        let message = '';

        switch (e.code) {
          case 'auth/wrong-password':
            message = 'Ihr Passwort ist falsch.';
            break;
          default:
            message = 'Login ungültig.';
        }
        this.snackBar.open(message, '', {duration: 2000});

      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  signOut() {
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/user/login']);
      })
      .catch(e => console.log(e.code));
  }

}
