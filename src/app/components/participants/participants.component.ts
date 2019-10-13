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
  userTab = '';
  Individual = true;
  userList = [
    {name: 'Team'},
    {name: 'Individual'}
  ];

  userRole = [];
  userRoleList = [];

  minVal = new FormControl('');
  maxVal = new FormControl('');
  participateTeam = new FormControl('');
  followersTeam = new FormControl('');

  constructor(private commonService: CommonService, private authService: AuthService, private http: HttpApiService,
              private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.userRoleList.push({name: 'Leader'},
      {name: 'Followers'},
      {name: 'Group Director'},
      {name: 'Coach'},
      {name: 'Facilitator'},
      {name: 'Reporter'});

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
      this.cdr.detectChanges();
    }
  }

  userType(name) {
    this.userTab = name;
    if (name === 'Individual') {
      this.Individual = false;
    } else {
      this.Individual = true;
    }
  }

  userRoleListType(name) {
    const index = this.userRole.indexOf(name);
    if (index === -1) {
      this.userRole.push(name);
    } else {
      this.userRole.splice(index, 1);
    }
  }

  checkUserRole(name) {
    if (this.userRole.indexOf(name) !== -1) {
      return true;
    } else {
      return false;
    }
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
      userRole: this.userRole
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
    const formdata = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        hostingStrategy,
        participant,
        design
      }
    };
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
    this.nextStep.emit('4');
  }
}
