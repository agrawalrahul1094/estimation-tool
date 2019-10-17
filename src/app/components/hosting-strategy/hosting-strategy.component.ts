import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/auth-service.service';
import {CommonService} from '../../shared/common.service';
import {HttpApiService} from '../../shared/http-api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatTabChangeEvent} from '@angular/material';

@Component({
  selector: 'app-hosting-strategy',
  templateUrl: './hosting-strategy.component.html',
  styleUrls: ['./hosting-strategy.component.styl']
})
export class HostingStrategyComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  treasuryForm: FormGroup;
  treasuryItems = new FormArray([]);

  devTab: any = [];
  deployement = [
    {name: 'Pre-Registration', deliverTab: 'Virtual', qa: 50, dev: 240, pm: 0, des: 0, checked: false},
    {name: 'Self-Registration', deliverTab: 'Virtual', qa: 50, dev: 240, pm: 0, des: 0, checked: false},
    {name: 'Scorm + LMS', deliverTab: 'Virtual', qa: 50, dev: 240, pm: 0, des: 0, checked: false},
    {name: 'LTI', deliverTab: 'Virtual', qa: 40, dev: 240, pm: 0, des: 0, checked: false},
    {name: 'SSO', deliverTab: 'Virtual', qa: 50, dev: 240, pm: 0, des: 0, checked: false},
    {name: 'Qkit', qa: 40, deliverTab: 'Workshop', dev: 240, pm: 0, des: 0, checked: false},
    {name: 'Local Server', deliverTab: 'Workshop', qa: 15, dev: 240, pm: 0, des: 0, checked: false}
  ]

  // signTab: any = '';
  // signType = [
  //   {name: 'SSO', qa: 0, dev: 0, pm: 0, des: 30},
  //   {name: 'Generic', qa: 0, dev: 0, pm: 0, des: 10},
  //   {name: 'Self-Registration', qa: 0, dev: 60, pm: 0, des: 30}
  // ];

  deliverTab = '';
  deliverList = ['Virtual', 'Workshop'];

  constructor(private authService: AuthService, private commonService: CommonService,
              private http: HttpApiService, private cdr: ChangeDetectorRef,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.treasuryForm = new FormGroup({
      treasuryItems: this.treasuryItems
    });

    const contentData: any = this.commonService.contentObject;
    console.log(contentData.content)
    if (contentData.content && contentData.content.hostingStrategy === undefined) {
      (<FormArray> this.treasuryForm.get('treasuryItems')).push(
        new FormGroup({
          date: new FormControl('', Validators.required),
          cityName: new FormControl('', Validators.required),
        })
      );
    }
  }

  ngAfterViewInit(): void {
    const setInt = setInterval(() => {
      if (this.commonService.contentObject) {
        const contentData: any = this.commonService.contentObject;
        if (contentData && contentData.content && contentData.content.hostingStrategy) {
          this.devTab = contentData.content.hostingStrategy.devTab;
          this.commonService.hostingDeploymentList = contentData.content.hostingStrategy.devTab;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.deployement.length; i ++) {
            const checked = this.devTab.map((o) => { return o.name; }).indexOf(this.deployement[i].name);
            if (checked === -1) {
              this.deployement[i].checked = false;
            } else {
              this.deployement[i].checked = true;
            }
          }



          this.deliverTab = contentData.content.hostingStrategy.deliverTab;
          for (let i = 0; i < contentData.content.hostingStrategy.signInDate.length; i++) {
            (<FormArray> this.treasuryForm.get('treasuryItems')).push(
              new FormGroup({
                date: new FormControl(contentData.content.hostingStrategy.signInDate[i].date, Validators.required),
                cityName: new FormControl(contentData.content.hostingStrategy.signInDate[i].cityName, Validators.required),
              })
            );
          }
        }
        clearInterval(setInt);
      }
    }, 500);
  }

  devlopementTab(dev) {
    const index = this.deployement.map((o) => { return o.name; }).indexOf(dev.name);
    this.deployement[index].checked = !this.deployement[index].checked;

    const checked = this.devTab.map((o) => { return o.name; }).indexOf(dev.name);
    if (checked === -1) {
      this.devTab.push(dev);
    } else {
      this.devTab.splice(checked, 1);
    }
    this.commonService.hostingDeploymentList = this.devTab;
    this.commonService.timeEfforts('', '', '');
    // this.devTab = dev;
    // if (this.devTab.name === 'Scorm + LMS') {
    //   this.devTab.dev = 60;
    //   this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    // } else if (this.devTab.name === 'Cloud') {
    //   this.devTab.dev = 30;
    //   this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    // } else {
    //   this.devTab.dev = 0;
    //   this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    // }
  }

  deliverTabFun(del) {
    this.deliverTab = del;
  }

  nextStepFun() {
    this.nextStep.emit('3');
  }

  save(formData) {
    if (this.deliverTab === '') {
      this.authService.openSnackBar('Please select delivery type', false);
      return false;
    }
    if (formData.treasuryItems.length === 0) {
      this.authService.openSnackBar('Please select altreast session / roll-outs date', false);
      return false;
    }
    if (this.devTab.length === 0) {
      this.authService.openSnackBar('Please select develepement type', false);
      return false;
    }
      // if (this.signTab === '') {
      //   this.authService.openSnackBar('Please select sign-in type', false);
      //   return false;
      // }


    const hostingStrategy = {
      devTab: this.devTab,
      deliverTab: this.deliverTab,
      signInDate: formData.treasuryItems
    };

    const contentData: any = this.commonService.contentObject;
    let basicInfo = {};
    if (contentData.content.basicInfo) {
      basicInfo = contentData.content.basicInfo;
    }
    let participant = {};
    if (contentData.content && contentData.content.participant !== undefined) {
      participant = contentData.content.participant;
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
      content: {}
    };

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
    };

    this.spinner.show();
    this.http.postApi('content', formdata).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(data => {
          const ret: any = data;
          this.commonService.contentObject = ret.message;
          this.nextStepFun();
        });
      } else {
        this.authService.openSnackBar('Please try again', false);
      }
    });
  }


  getControls() {
    return (<FormArray> this.treasuryForm.get('treasuryItems')).controls;
  }

  onAddItem() {
    (<FormArray> this.treasuryForm.get('treasuryItems')).push(
      new FormGroup({
        date: new FormControl('', Validators.required),
        cityName: new FormControl('', Validators.required),
      })
    );
  }

  remove(i) {
    (<FormArray> this.treasuryForm.get('treasuryItems')).removeAt(i);
  }
}
