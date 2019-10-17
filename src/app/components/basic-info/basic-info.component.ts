import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AuthService} from '../../shared/auth-service.service';
import {CommonService} from '../../shared/common.service';
import {HttpApiService} from '../../shared/http-api.service';
import {serialize} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.styl']
})
export class BasicInfoComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('tabGroup', {static: true}) tabGroup;
  @ViewChild('tabGroup1', {static: true}) tabGroup1;

  product = '';
  tabIndex = 0;
  tabIndexLanguage = 0;
  navTab = '';

  language = new FormControl();
  langSelected = [];
  clientDate = new FormControl();
  pilotDate = new FormControl();
  launchDate = new FormControl();


  tab1 = [
    'Moment Based Simulation',
    'Know the Business',
    'Cascade',
    'Moment based Assessment',
    'iLeads',
    'Multipliers',
    'Virtual Assessment',
    'Practice with an Expert',
    'Sales Accelerator',
    'Portrait',
    'Upskill',
    'Live Webcast',
    'Strategy Sim',
    'BA - 1',
    'BA - 2',
    'Winning in Business',
    'WIB Lite',
    'What a Day'
  ];

  languageList = [
    {lang: 'English', checked: true, qa: 0, dev: 240, pm: 0, des: 0},
    {lang: 'Chinese', checked: true, qa: 0, dev: 240, pm: 0, des: 0},
    {lang: 'Spanish', checked: true, qa: 0, dev: 240, pm: 0, des: 0},
    {lang: 'Portuguese', checked: true, qa: 0, dev: 240, pm: 0, des: 0},
    {lang: 'Russian', checked: true, qa: 0, dev: 240, pm: 0, des: 0}
  ];
  navigation = [
    {name: 'Facilitator Controlled', qa: 0, dev: 240, pm: 0, des: 15},
    {name: 'Self-Paced', qa: 0, dev: 120, pm: 0, des: 15},
    {name: 'Hybrid', qa: 0, dev: 360, pm: 0, des: 15}
  ];
  // users = [
  //   { name: 'name1', checked: false },
  //   { name: 'name2', checked: false },
  //   { name: 'object3', checked: false }
  // ]
  selectedLang = [];

  constructor(private authService: AuthService, private commonService: CommonService,
              private http: HttpApiService, private cdr: ChangeDetectorRef,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    // this.selectedLang.push(this.users[0], this.users[1], this.users[2])

  }

  ngAfterViewInit(): void {

    const contentData: any = this.commonService.contentObject;
    if (contentData && contentData.content) {

      if (contentData.content.basicInfo.languageTab === 1) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.languageList.length; i++) {
          for (let j = 0; j < contentData.content.basicInfo.language.length; j++) {
            if (this.languageList[i].lang === contentData.content.basicInfo.language[j].lang) {
              this.selectedLang.push(this.languageList[i]);
            }
          }

        }
      }
      // this.tabGroup.selectedIndex = contentData.content.basicInfo.productTab;
      this.product = contentData.content.basicInfo.product;
      this.tabGroup1.selectedIndex = contentData.content.basicInfo.languageTab;
      this.clientDate.setValue(contentData.content.basicInfo.clientDate);
      this.pilotDate.setValue(contentData.content.basicInfo.pilotDate);
      this.launchDate.setValue(contentData.content.basicInfo.launchDate);
      this.navTab = contentData.content.basicInfo.navTab;
      this.cdr.detectChanges();
    }
  }

  currentTab(name) {
    this.product = name;
  }


  tabChangedLanguage = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabIndexLanguage = tabChangeEvent.index;
    if (this.tabIndexLanguage === 0) {
      const time = {
        multi: Number(0)
      };
      this.commonService.timeEfforts(time, 'basicInfo', 'multi_language');
    } else {
      const time = {
        multi: Number(this.selectedLang.length * 120)
      };
      this.commonService.timeEfforts(time, 'basicInfo', 'multi_language');
    }
  }

  navigationTab(nav) {
    this.commonService.timeEfforts(nav, 'basicInfo', 'navigate');
    this.navTab = nav.name;
    console.log(this.navTab)
  }

  save() {
    if (this.product === '') {
      this.authService.openSnackBar('Please select product', false);
      return false;
    }
    if (this.tabIndexLanguage > 0) {
      if (this.selectedLang.length === 0) {
        this.authService.openSnackBar('Please select atleast one language', false);
        return false;
      }
      // console.log(this.language.value)
    }
    if (this.pilotDate.value === null) {
      this.authService.openSnackBar('Please select Pilot Date', false);
      return false;
    }

    const basicInfo = {
      productTab: this.tabIndex,
      product: this.product,
      languageTab: this.tabIndexLanguage,
      language: this.selectedLang,
      clientDate: this.clientDate.value,
      pilotDate: this.pilotDate.value,
      launchDate: this.launchDate.value,
      navTab: this.navTab
    };
    const contentData: any = this.commonService.contentObject;
    let hostingStrategy = {};
    if (contentData.content && contentData.content.hostingStrategy !== undefined) {
      hostingStrategy = contentData.content.hostingStrategy;
    }
    let participant = {};
    if (contentData.content && contentData.content.participant !== undefined) {
      participant = contentData.content.participant;
    }
    const formdata = {
      createRequestID: localStorage.getItem('_id'),
      content: {}
    };
    let design = {};
    if (contentData.content && contentData.content.design !== undefined) {
      design = contentData.content.design;
    }
    let content = {};
    if (contentData.content && contentData.content.content !== undefined) {
      content = contentData.content.content;
    }
    let structure = {};
    if (contentData.content && contentData.content.structure !== undefined) {
      structure = contentData.content.structure;
    }
    let score = {};
    if (contentData.content && contentData.content.score !== undefined) {
      score = contentData.content.score;
    }
    formdata.content = {
      basicInfo,
      hostingStrategy,
      participant,
      design,
      structure,
      content,
      score,
      timeEfforts: this.commonService.calcObj,
      participateUserRoleList: this.commonService.participateUserRoleList,
      structureActivitiesList: this.commonService.structureActivitiesList,
      hostingDeploymentList: this.commonService.hostingDeploymentList
    }
    this.spinner.show();
    this.http.postApi('content', formdata).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(res => {
          const ret: any = res;
          this.commonService.contentObject = ret.message;
          this.nextStepFun();
        });
      } else {
        this.authService.openSnackBar('Please try again', false);
      }
    });
  }

  nextStepFun() {
    this.nextStep.emit('2');
  }

  selectLanguage(e) {
    let time;
    if (this.tabGroup1.selectedIndex === 1) {

      if (e.value.length > 0) {
          time = {
            multi: Number(e.value.length * 120)
          };
      } else {
        time = {
          multi: 0
        };
      }
      this.commonService.timeEfforts(time, 'basicInfo', 'multi_language');
    }
  }

}
