import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../shared/auth-service.service';
import {CommonService} from '../../shared/common.service';
import {HttpApiService} from '../../shared/http-api.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.styl']
})
export class ScoreComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  numofMetrics = new FormControl('');
  constructor(private authService: AuthService,
              private commonService: CommonService,
              private http: HttpApiService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const setInt = setInterval(() => {
      const contentData: any = this.commonService.contentObject;
      if (contentData && contentData.content && contentData.content.score) {
        this.numofMetrics.setValue(contentData.content.score.numofMetrics);
        clearInterval(setInt);
      }
    }, 500);

  }

  save() {
    if (this.numofMetrics.value === '') {
      this.authService.openSnackBar('Please enter number of metrics', false);
      return false;
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
    let content = {};
    if (contentData.content && contentData.content.content !== undefined) {
      content = contentData.content.content;
    }

    const score = {
      numofMetrics: this.numofMetrics.value
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
        structureActivitiesList: this.commonService.structureActivitiesList
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
    this.nextStep.emit('8');
  }
}
