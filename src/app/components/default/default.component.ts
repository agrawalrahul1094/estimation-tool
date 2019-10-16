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
      if (ret.message.content && ret.message.content.timeEfforts !== undefined) {
        if (ret.message.content.timeEfforts.basicInfo !== undefined) {
          this.commonService.calcObj.basicInfo = ret.message.content.timeEfforts.basicInfo;
        }
        if (ret.message.content.timeEfforts.hostingStrategy !== undefined) {
          this.commonService.calcObj.hostingStrategy = ret.message.content.timeEfforts.hostingStrategy;
        }
        if (ret.message.content.timeEfforts.participate !== undefined) {
          this.commonService.calcObj.participate = ret.message.content.timeEfforts.participate;
          if (ret.message.content.participateUserRoleList !== undefined) {
            this.commonService.participateUserRoleList = ret.message.content.participateUserRoleList;
          }
        }
        if (ret.message.content.timeEfforts.design !== undefined) {
          this.commonService.calcObj.design = ret.message.content.timeEfforts.design;
        }
        if (ret.message.content.timeEfforts.structure !== undefined) {
          this.commonService.calcObj.structure = ret.message.content.timeEfforts.structure;
          if (ret.message.content.structureActivitiesList !== undefined) {
            this.commonService.structureActivitiesList = ret.message.content.structureActivitiesList;
          }
        }
        this.commonService.getTimeEfforts();
      }
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
    this.spinner.hide();
    this.commonService.stage = Number(e);
    this.commonService.stageActive = Number(e);
    this.commonService.stageAvailable = this.commonService.stageAvailable < this.commonService.stage ? this.commonService.stage : this.commonService.stageAvailable;
    // setTimeout(() => {
    //   this.moveScroll(e);
    // }, 1000);
  }

}
