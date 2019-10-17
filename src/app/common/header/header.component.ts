import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../../shared/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit() {
  }

  logout() {
    this.commonService.devTime = 0;
    this.commonService.desTime = 0;
    this.commonService.qaTime = 0;
    this.commonService.pmTime = 0;
    this.commonService.totTime = 0;
    this.commonService.loginSubject.next(false);
    this.commonService.stageActive = 1;
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
