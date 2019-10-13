import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../shared/common.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl']
})
export class ContentComponent implements OnInit {
  trans = false;

  suppportTab = '';
  supportList = [
    {name: 'Account Manager to provide'},
    {name: 'Client to provide'},
    {name: 'Digital to Write'},
  ]

  translationTab = '';
  translationList = [
    {name: 'Account Manager to provide'},
    {name: 'Client to provide'},
    {name: 'Digital to Write'},
  ]
  constructor(public commonService: CommonService) { }

  ngOnInit() {
    const setInt = setInterval(() => {
      const contentObj: any = this.commonService.contentObject;
      if (contentObj) {
        if (contentObj && contentObj.content.basicInfo.languageTab === 1) {
          this.trans = true;
        } else {
          this.trans = false;
        }
        clearInterval(setInt);
      }
    }, 500);
  }

  supportTabFun(t1) {
    this.suppportTab = t1.name;
  }

  translationTabFun(t1) {
    this.translationTab = t1.name;
  }

}
