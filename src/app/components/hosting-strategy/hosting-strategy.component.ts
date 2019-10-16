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

  devTab: any = {};
  deployement = [
    {name: 'LTI', qa: 40, dev: 240, pm: 0, des: 0},
    {name: 'Cloud', qa: 20, dev: 240, pm: 0, des: 0},
    {name: 'Scorm + LMS', qa: 50, dev: 240, pm: 0, des: 0},
    {name: 'Qkit', qa: 40, dev: 240, pm: 0, des: 0},
    {name: 'Offline', qa: 15, dev: 240, pm: 0, des: 0}
  ]

  signTab: any = '';
  signType = [
    {name: 'SSO', qa: 0, dev: 0, pm: 0, des: 30},
    {name: 'Generic', qa: 0, dev: 0, pm: 0, des: 10},
    {name: 'Self-Registration', qa: 0, dev: 60, pm: 0, des: 30}
  ];

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
    if (contentData.content.hostingStrategy === undefined) {
      (<FormArray> this.treasuryForm.get('treasuryItems')).push(
        new FormGroup({
          date: new FormControl('', Validators.required),
          cityName: new FormControl('', Validators.required),
        })
      );
    }
  }

  ngAfterViewInit(): void {
    const contentData: any = this.commonService.contentObject;
    if (contentData && contentData.content && contentData.content.hostingStrategy) {
      this.devTab = contentData.content.hostingStrategy.devTab;
      this.signTab = contentData.content.hostingStrategy.signTab;
      this.deliverTab = contentData.content.hostingStrategy.deliverTab;
      for (let i = 0; i < contentData.content.hostingStrategy.signInDate.length; i++) {
        (<FormArray> this.treasuryForm.get('treasuryItems')).push(
          new FormGroup({
            date: new FormControl(contentData.content.hostingStrategy.signInDate[i].date, Validators.required),
            cityName: new FormControl(contentData.content.hostingStrategy.signInDate[i].cityName, Validators.required),
          })
        );
      }
      this.cdr.detectChanges();
    }
  }

  devlopementTab(dev) {
    this.devTab = dev;
    if (this.devTab.name === 'Scorm + LMS') {
      this.devTab.dev = 60;
      this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    } else if (this.devTab.name === 'Cloud') {
      this.devTab.dev = 30;
      this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    } else {
      this.devTab.dev = 0;
      this.commonService.timeEfforts(this.devTab, 'hostingStrategy', 'deployement');
    }
  }

  signTabFun(sign) {
    this.signTab = sign;
    this.commonService.timeEfforts(this.signTab, 'hostingStrategy', 'signUp');
  }

  deliverTabFun(del) {
    this.deliverTab = del;
  }

  nextStepFun() {
    this.nextStep.emit('3');
  }

  save(formData) {
    if (formData.treasuryItems.length === 0) {
      this.authService.openSnackBar('Please select altreast session / roll-outs date', false);
      return false;
    }
    if (this.devTab === '') {
      this.authService.openSnackBar('Please select develepement type', false);
      return false;
    }
    if (this.signTab === '') {
      this.authService.openSnackBar('Please select sign-in type', false);
      return false;
    }
    if (this.deliverTab === '') {
      this.authService.openSnackBar('Please select delivery type', false);
      return false;
    }

    const hostingStrategy = {
      devTab: this.devTab,
      signTab: this.signTab,
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

    console.log(this.commonService.calcObj)
    formdata.content = {
      basicInfo,
      hostingStrategy,
      participant,
      design,
      structure,
      content,
      score,
      timeEfforts: this.commonService.calcObj
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
        date: new FormControl('', Validators.required)
      })
    );
  }

  remove(i) {
    (<FormArray> this.treasuryForm.get('treasuryItems')).removeAt(i);
  }
}
