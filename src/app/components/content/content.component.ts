import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {AuthService} from '../../shared/auth-service.service';
import {HttpApiService} from '../../shared/http-api.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl']
})
export class ContentComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  trans = false;

  suppportTab: any = '';
  supportList = [
    {name: 'Account Manager to provide'},
    {name: 'Client to provide'},
    {name: 'Digital to Write'},
  ]

  contentTab: any = '';
  contentList = [
    {name: 'Dev. Team'},
    {name: 'Consultant'},
    {name: 'Acc. Team'},
  ]

  translationTab = '';
  translationList = [
    {name: 'Account Manager to provide'},
    {name: 'Client to provide'},
    {name: 'Digital to Write'},
  ]
  constructor(public commonService: CommonService, private authService: AuthService,
              private http: HttpApiService, private spinner: NgxSpinnerService) { }

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

  ngAfterViewInit(): void {
    const setInt = setInterval(() => {
      const contentData: any = this.commonService.contentObject;
      if (contentData && contentData.content && contentData.content.content) {
          this.suppportTab = contentData.content.content.suppportTab;
          this.translationTab = contentData.content.content.translationTab;
          this.contentTab = contentData.content.content.contentTab;
          clearInterval(setInt);
      }
    }, 500);
  }

  supportTabFun(t1) {
    this.suppportTab = t1.name;
    let time = {};
    if (this.suppportTab === 'Client to provide' || this.suppportTab === 'Digital to Write') {
      time = {
        qa: 120,
        pm: 0,
        dev: 0,
        des: 0
      };
    } else {
      time = {
        qa: 0,
        pm: 0,
        dev: 0,
        des: 0
      };
    }
    this.commonService.devTimeEfforts(time, 'content', 'contentSupport');
  }

  contentTabFun(t1) {
    this.contentTab = t1.name;
    let time = {};
    if (this.contentTab === 'Dev. Team') {
      time = {
        qa: 0,
        pm: 0,
        dev: 960,
        des: 0
      };
    } else {
      time = {
        qa: 0,
        pm: 0,
        dev: 0,
        des: 0
      };
    }
    console.log(time)
    this.commonService.devTimeEfforts(time, 'content', 'contentInput');
  }

  translationTabFun(t1) {
    this.translationTab = t1.name;
  }

  save() {
    if (this.suppportTab === '') {
        this.authService.openSnackBar('Please select content support', false);
        return false;
    }

    if (!this.trans) {
      if (this.translationTab === '') {
        this.authService.openSnackBar('Please select translation', false);
        return false;
      }
    }

    const contentData: any = this.commonService.contentObject;
    let basicInfo = {};
    if (contentData.content.basicInfo) {
      basicInfo = contentData.content.basicInfo;
    }
    let participant = {};
    if (contentData.content && contentData.content.participant !== undefined) {
      participant = contentData.content.participant;
    }
    let hostingStrategy = {};
    if (contentData.content && contentData.content.hostingStrategy !== undefined) {
      hostingStrategy = contentData.content.hostingStrategy;
    }
    let design = {};
    if (contentData.content && contentData.content.design !== undefined) {
      design = contentData.content.design;
    }
    let structure = {};
    if (contentData.content && contentData.content.structure !== undefined) {
      structure = contentData.content.structure;
    }
    let score = {};
    if (contentData.content && contentData.content.score !== undefined) {
      score = contentData.content.score;
    }

    const content = {
      suppportTab: this.suppportTab,
      translationTab: this.translationTab,
      contentTab: this.contentTab
    };

    const formData = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        participant,
        hostingStrategy,
        design,
        structure,
        content,
        score,
        timeEfforts: this.commonService.calcObj,
        participateUserRoleList: this.commonService.participateUserRoleList,
        structureActivitiesList: this.commonService.structureActivitiesList,
        hostingDeploymentList: this.commonService.hostingDeploymentList
      }
    };

    this.spinner.show();
    this.http.postApi('content', formData).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(ret => {
          const result1: any = ret;
          this.commonService.contentObject = result1.message;
          this.nextStepFun();
        });
      } else {
        this.authService.openSnackBar('Please try again', false);
      }
    });
  }

  nextStepFun() {
    this.nextStep.emit('7');
  }
}
