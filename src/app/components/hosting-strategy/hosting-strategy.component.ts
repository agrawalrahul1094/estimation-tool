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

  devTab = '';
  deployement = [
    'LMS',
    'Cloud',
    'Scorm + LMS',
    'Qkit',
    'Offline'
  ]

  signTab = '';
  signType = [
    'SSO',
    'Generic',
    'Self-Registration'
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
          })
        );
      }
      this.cdr.detectChanges();
    }
  }

  devlopementTab(dev) {
    this.devTab = dev;
  }

  signTabFun(sign) {
    this.signTab = sign;
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
    const formdata = {
      createRequestID: localStorage.getItem('_id'),
      content: {}
    };

    formdata.content = {
      basicInfo,
      hostingStrategy
    };

    this.spinner.show();
    this.http.postApi('content', formdata).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(data => {
          const ret: any = data;
          this.commonService.contentObject = ret.message;
          console.log(this.commonService.contentObject)
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
