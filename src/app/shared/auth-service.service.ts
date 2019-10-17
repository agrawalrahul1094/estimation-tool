import { Injectable } from '@angular/core';
import {NotificationComponent} from '../common/notification/notification.component';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  durationInSeconds = 300;
  constructor(private snackBar: MatSnackBar) { }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  openSnackBar(msg, flag) {
    const classname = flag ? 'success-snackbar' : 'failure-snackbar'
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: [classname],
      data: {
        msg,
        flag
      }
    });
  }
}
