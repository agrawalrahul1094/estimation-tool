import {Component, OnInit} from '@angular/core';
import {CommonService} from './shared/common.service';
import {AuthService} from './shared/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  loggedIn = false;
  constructor(public commonService: CommonService, private authService: AuthService) {}
  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.loggedIn = true;
    }
    this.commonService.passingLoginSubject().subscribe(res => {
      this.loggedIn = res;
    });
  }
}
