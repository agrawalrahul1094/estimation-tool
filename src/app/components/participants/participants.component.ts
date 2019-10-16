import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../shared/common.service';
import {AuthService} from '../../shared/auth-service.service';
import {HttpApiService} from '../../shared/http-api.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.styl']
})
export class ParticipantsComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  scaleTesting = false;
  userTab: any = '';
  Individual = true;
  userList = [
    {name: 'Team', qa: 0, dev: 45, pm: 0, des: 0},
    {name: 'Individual', qa: 0, dev: 30, pm: 0, des: 0}
  ];

  userRole = [];
  userRoleList = [];

  minVal = new FormControl('');
  maxVal = new FormControl('');
  participateTeam = new FormControl('');
  followersTeam = new FormControl('');

  constructor(public commonService: CommonService, private authService: AuthService, private http: HttpApiService,
              private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.userRoleList.push(
      {name: 'Leader', qa: 0, dev: 0, pm: 0, des: 0},
      {name: 'Followers', qa: 0, dev: 180, pm: 0, des: 0},
      {name: 'Group Director', qa: 30, dev: 30, pm: 0, des: 0},
      {name: 'Coach', qa: 60, dev: 30, pm: 0, des: 15},
      {name: 'Facilitator', qa: 60, dev: 30, pm: 0, des: 0},
      {name: 'Reporter', qa: 60, dev: 30, pm: 0, des: 30}
      );

  }

  ngAfterViewInit(): void {
    const contentData: any = this.commonService.contentObject;
    if (contentData && contentData.content && contentData.content.participant) {
      this.userTab = contentData.content.participant.userTab;
      this.minVal.setValue(contentData.content.participant.minVal);
      this.maxVal.setValue(contentData.content.participant.maxVal);
      this.participateTeam.setValue(contentData.content.participant.participateTeam);
      this.followersTeam.setValue(contentData.content.participant.followersTeam);
      this.userRole = contentData.content.participant.userRole;
      this.scaleTesting = contentData.content.participant.scaleTesting;
      this.cdr.detectChanges();
    }
  }

  userType(name) {
    this.userTab = name;
    if (this.userTab.name === 'Individual') {
      this.Individual = false;
    } else {
      this.Individual = true;
    }
    this.commonService.timeEfforts(this.userTab, 'participate', 'userType');
  }

  userRoleListType(name, obj) {
    const index = this.userRole.indexOf(name);
    if (index === -1) {
      this.userRole.push(name);
      this.addTimeEfforts(obj, 'add');
    } else {
      this.addTimeEfforts(obj, 'minus');
      this.userRole.splice(index, 1);
    }
  }

  checkUserRole(obj, name) {
    if (this.userRole.indexOf(name) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  addTimeEfforts(obj, type) {
    if (type === 'add') {
      this.commonService.participateUserRoleList.push(obj);
      this.commonService.timeEfforts('', '', '');
    } else {
      const index = this.commonService.participateUserRoleList.indexOf(obj);
      this.commonService.participateUserRoleList.splice(index, 1);
      this.commonService.timeEfforts('', '', '');
    }
  }

  scaleTestingFun(e) {
    let timeEff = {};
    if (e.checked) {
      timeEff = {
        qa: 2100,
        dev: 0,
        pm: 0,
        des: 0
      };
    } else {
      timeEff = {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      };
    }
    this.scaleTesting = e.checked;
    this.commonService.timeEfforts(timeEff, 'participate', 'scaleTesting');
  }

  save() {
    if (this.userTab === '') {
      this.authService.openSnackBar('Please select user role', false);
      return false;
    }
    if (this.minVal.value === '' || this.maxVal.value === '') {
      this.authService.openSnackBar('Please enter min and max per team value', false);
      return false;
    }
    if (this.userTab === 'Team') {
      if (this.participateTeam.value === '' || this.followersTeam.value === '') {
        this.authService.openSnackBar('Please enter participate and followers per team value', false);
        return false;
      }
    }
    if (this.userTab === 'Individual') {
      if (this.participateTeam.value === '' || this.followersTeam.value === '') {
        this.authService.openSnackBar('Please enter participate and followers per team value', false);
        return false;
      }
    }
    if (this.userRole.length === 0) {
      this.authService.openSnackBar('Please select atleast one user role', false);
      return false;
    }
    const participant = {
      userTab: this.userTab,
      minVal: this.minVal.value,
      maxVal: this.maxVal.value,
      participateTeam: this.participateTeam.value,
      followersTeam: this.followersTeam.value,
      userRole: this.userRole,
      scaleTesting: this.scaleTesting
    };
    this.postData(participant);
  }

  postData(participant) {
    const contentData: any = this.commonService.contentObject;
    let basicInfo = {};
    if (contentData.content.basicInfo) {
      basicInfo = contentData.content.basicInfo;
    }
    let hostingStrategy = {};
    if (contentData.content && contentData.content.hostingStrategy !== undefined) {
      hostingStrategy = contentData.content.hostingStrategy;
    }
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
    const formdata = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        hostingStrategy,
        participant,
        design,
        content,
        structure,
        score,
        timeEfforts: this.commonService.calcObj,
        participateUserRoleList: this.commonService.participateUserRoleList,
        structureActivitiesList: this.commonService.structureActivitiesList
      }
    };
    this.spinner.show();
    this.http.postApi('content', formdata).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(res1 => {
          const ret: any = res1;
          this.commonService.contentObject = ret.message;
          this.nextStepFun();
        });
      } else {
        this.authService.openSnackBar('Please try again', false);
      }
    });
  }

  nextStepFun() {
    this.nextStep.emit('4');
  }
}
