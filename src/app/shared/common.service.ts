import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpApiService} from './http-api.service';
import {AuthService} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loginSubject = new Subject<any>();
  public contentObject = {};
  stage = 1;

  qaTime = 0;
  pmTime = 0;
  devTime = 0;
  desTime = 0;
  totTime = 0;

  calcObj = {
    basicInfo: {
      navigate: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      }
    }
  }

  constructor(private spinner: NgxSpinnerService, private http: HttpApiService, private authService: AuthService,
              private commonService: CommonService) { }

  passingLoginSubject() {
    return this.loginSubject.asObservable();
  }

  timeEfforts(time, type, module) {
    this.devTimeEfforts(time, type, module);
    // this.qaTimeEffort(time);
  }

  qaTimeEffort(time) {
    const hrs = Number(time.qa / 60);
    this.qaTime = this.qaTime + hrs;
  }

  designTimeEfforts(time) {

  }

  pmTimeEfforts(time) {

  }

  devTimeEfforts(time, type, module) {
    if (type === 'basicInfo') {
      if (module === 'navigate') {
        const devHrs = Number(time.dev / 60);
        const desHrs = Number(time.des / 60);
        const qaHrs = Number(time.qa / 60);
        const pmHrs = Number(time.pm / 60);

        this.calcObj.basicInfo.navigate.dev = devHrs;
        this.calcObj.basicInfo.navigate.des = desHrs;
        this.calcObj.basicInfo.navigate.qa = qaHrs;
        this.calcObj.basicInfo.navigate.pm = pmHrs;
      }
    }

    this.devTime = this.totalDevelopementTimeEfforts();
    this.desTime = this.totalDesigningTimeEfforts();
    this.qaTime = this.totalQaTimeEfforts()
    this.pmTime = this.totalPmTimeEfforts();

    this.totTime = this.devTime + this.desTime + this.qaTime + this.pmTime;
  }

  totalDevelopementTimeEfforts() {
      return this.calcObj.basicInfo.navigate.dev;
  }

  totalDesigningTimeEfforts() {
    return this.calcObj.basicInfo.navigate.des;
  }

  totalQaTimeEfforts() {
    return this.calcObj.basicInfo.navigate.qa;
  }

  totalPmTimeEfforts() {
    return this.calcObj.basicInfo.navigate.pm;
  }

}
