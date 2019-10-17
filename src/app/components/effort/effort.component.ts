import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonService } from 'src/app/shared/common.service';
import {HttpApiService} from '../../shared/http-api.service';

@Component({
  selector: 'app-effort',
  templateUrl: './effort.component.html',
  styleUrls: ['./effort.component.styl']
})
export class EffortComponent implements OnInit, AfterViewInit {

  constructor(private commonService: CommonService, private http: HttpApiService) { }
  effortsParam: Array<any> = [];
  totalEffort;
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
        if (ret.message.content.timeEfforts.content !== undefined) {
          this.commonService.calcObj.content = ret.message.content.timeEfforts.content;
        }
        this.commonService.getTimeEfforts();
      }
    });

  }

  ngAfterViewInit(): void {
    const setInt = setInterval(() => {
      if (this.commonService.totTime > 0) {
        this.effortsParam = [
          {value: this.commonService.devTime,
          label: 'Development'},
          {value: this.commonService.desTime,
          label: 'Design'},
          {value: this.commonService.qaTime,
          label: 'QA'},
          {value: this.commonService.pmTime,
          label: 'PM'}
        ];
        this.totalEffort = this.commonService.totTime;
        clearInterval(setInt);
      }
    }, 500);
  }

}
