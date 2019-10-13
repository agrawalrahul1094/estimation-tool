import { Component, OnInit } from '@angular/core';
import {HttpApiService} from '../../shared/http-api.service';
import {CommonService} from '../../shared/common.service';
import {NgxSpinnerService} from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.styl']
})
export class DefaultComponent implements OnInit {
  getData = false;
  constructor(private http: HttpApiService, private commonService: CommonService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(res => {
      const ret: any = res;
      this.commonService.contentObject = ret.message;
      this.getData = true;
    });
  }

  moveScroll(step) {
    const element = document.getElementById(step);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
      this.spinner.hide();
    }
  }

  setActiveStage(stage) {
    this.commonService.stageActive = stage;
  }

  nextStep(e) {
    this.commonService.stage = Number(e);
    setTimeout(() => {
      this.moveScroll(e);
    }, 1000);
  }

}
