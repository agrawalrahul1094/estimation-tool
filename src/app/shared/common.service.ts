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
  stageAvailable = 1;
  stageActive = 1;

  stageName = [
    'Basic Information',
    'Hosting Strategy',
    'Participants',
    'Design',
    'Structure',
    'Content',
    'Score'
  ];

  qaTime = 0;
  pmTime = 0;
  devTime = 0;
  desTime = 0;
  totTime = 0;
  participateUserRoleList = [];

  calcObj = {
    basicInfo: {
      navigate: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      multiLang: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      }
    },
    hostingStrategy: {
      deployement: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      signUp: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      }
    },
    participate: {
      userType: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      scaleTesting: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      userRole: []
    },
    design: {
      protoType: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      device: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
    }
  };

  constructor(private spinner: NgxSpinnerService, private http: HttpApiService, private authService: AuthService,
              private commonService: CommonService) {
  }

  passingLoginSubject() {
    return this.loginSubject.asObservable();
  }

  getTimeEfforts() {
    this.devTime = this.totalDevelopementTimeEfforts();
    this.desTime = this.totalDesigningTimeEfforts();
    this.qaTime = this.totalQaTimeEfforts();
    this.pmTime = this.totalPmTimeEfforts();

    const total = this.devTime + this.desTime + this.qaTime + this.pmTime
    this.totTime = Number(total.toFixed(2));
  }

  timeEfforts(time, type, module) {
    this.devTimeEfforts(time, type, module);
    // this.qaTimeEffort(time);
  }

  devTimeEfforts(time, type, module) {
    let devHrs;
    let desHrs;
    let qaHrs;
    let pmHrs;
    if (type === 'basicInfo') {
      if (module === 'navigate') {
        devHrs = Number(time.dev / 60);
        desHrs = Number(time.des / 60);
        qaHrs = Number(time.qa / 60);
        pmHrs = Number(time.pm / 60);

        this.calcObj.basicInfo.navigate.dev = devHrs;
        this.calcObj.basicInfo.navigate.des = desHrs;
        this.calcObj.basicInfo.navigate.qa = qaHrs;
        this.calcObj.basicInfo.navigate.pm = pmHrs;
      } else if (module === 'multi_language') {
        devHrs = Number(time.multi / 60);
        this.calcObj.basicInfo.multiLang.dev = devHrs;
        this.calcObj.basicInfo.multiLang.des = 0;
        this.calcObj.basicInfo.multiLang.qa = 0;
        this.calcObj.basicInfo.multiLang.pm = 0;
      }
    } else if (type === 'hostingStrategy') {
      if (module === 'deployement') {
        devHrs = Number(time.dev / 60);
        desHrs = Number(time.des / 60);
        qaHrs = Number(time.qa / 60);
        pmHrs = Number(time.pm / 60);

        this.calcObj.hostingStrategy.deployement.dev = devHrs;
        this.calcObj.hostingStrategy.deployement.des = desHrs;
        this.calcObj.hostingStrategy.deployement.qa = qaHrs;
        this.calcObj.hostingStrategy.deployement.pm = pmHrs;
      } else if (module === 'signUp') {
        devHrs = Number(time.dev / 60);
        desHrs = Number(time.des / 60);
        qaHrs = Number(time.qa / 60);
        pmHrs = Number(time.pm / 60);

        this.calcObj.hostingStrategy.deployement.dev = devHrs;
        this.calcObj.hostingStrategy.deployement.des = desHrs;
        this.calcObj.hostingStrategy.deployement.qa = qaHrs;
        this.calcObj.hostingStrategy.deployement.pm = pmHrs;
      }
    } else if (type === 'participate') {
      if (module === 'userType') {
        devHrs = Number(time.dev / 60);
        desHrs = Number(time.des / 60);
        qaHrs = Number(time.qa / 60);
        pmHrs = Number(time.pm / 60);

        this.calcObj.participate.userType.dev = devHrs;
        this.calcObj.participate.userType.des = desHrs;
        this.calcObj.participate.userType.qa = qaHrs;
        this.calcObj.participate.userType.pm = pmHrs;
      } else if (module === 'scaleTesting') {
        devHrs = Number(time.dev / 60);
        desHrs = Number(time.des / 60);
        qaHrs = Number(time.qa / 60);
        pmHrs = Number(time.pm / 60);

        this.calcObj.participate.scaleTesting.dev = devHrs;
        this.calcObj.participate.scaleTesting.des = desHrs;
        this.calcObj.participate.scaleTesting.qa = qaHrs;
        this.calcObj.participate.scaleTesting.pm = pmHrs;
      }
    } else if (type === 'design') {
      if (module === 'protoType') {
        desHrs = this.getDesignPrototype(time);
        this.calcObj.design.protoType.dev = 0;
        this.calcObj.design.protoType.des = desHrs;
        this.calcObj.design.protoType.qa = 0;
        this.calcObj.design.protoType.pm = 0;
      } else if (module === 'device') {
        desHrs = this.getDesignPrototype(time);
        qaHrs = this.getDesignQaPrototype(time);
        this.calcObj.design.device.dev = 0;
        this.calcObj.design.device.des = desHrs;
        this.calcObj.design.device.qa = qaHrs;
        this.calcObj.design.device.pm = 0;
      }
    }

    this.devTime = this.totalDevelopementTimeEfforts();
    this.desTime = this.totalDesigningTimeEfforts();
    this.qaTime = this.totalQaTimeEfforts();
    this.pmTime = this.totalPmTimeEfforts();
    const total = this.devTime + this.desTime + this.qaTime + this.pmTime
    this.totTime = Number(total.toFixed(2));
  }

  totalDevelopementTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('dev');
    const dev = this.calcObj.basicInfo.navigate.dev +
      this.calcObj.basicInfo.multiLang.dev +
      this.calcObj.hostingStrategy.deployement.dev +
      this.calcObj.hostingStrategy.signUp.dev +
      this.calcObj.participate.userType.dev +
      this.calcObj.participate.scaleTesting.dev + getParticipateUserRoleList +
      this.calcObj.design.protoType.dev +
      this.calcObj.design.device.dev;
    return dev;
  }

  totalDesigningTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('des');
    const des = this.calcObj.basicInfo.navigate.des +
      this.calcObj.basicInfo.multiLang.des +
      this.calcObj.hostingStrategy.deployement.des +
      this.calcObj.hostingStrategy.signUp.des +
      this.calcObj.participate.userType.des +
      this.calcObj.participate.scaleTesting.des + getParticipateUserRoleList +
      this.calcObj.design.protoType.des +
      this.calcObj.design.device.des;
    return des;
  }

  totalQaTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('qa');
    const qa = this.calcObj.basicInfo.navigate.qa +
      this.calcObj.basicInfo.multiLang.qa +
      this.calcObj.hostingStrategy.deployement.qa +
      this.calcObj.hostingStrategy.signUp.qa +
      this.calcObj.participate.userType.qa +
      this.calcObj.participate.scaleTesting.qa + getParticipateUserRoleList +
      this.calcObj.design.protoType.qa +
      this.calcObj.design.device.qa;
    return qa;
  }

  totalPmTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('pm');
    const pm = this.calcObj.basicInfo.navigate.pm +
      this.calcObj.basicInfo.multiLang.pm +
      this.calcObj.hostingStrategy.deployement.pm +
      this.calcObj.hostingStrategy.signUp.pm +
      this.calcObj.participate.userType.pm +
      this.calcObj.participate.scaleTesting.pm + getParticipateUserRoleList +
      this.calcObj.design.protoType.pm +
      this.calcObj.design.device.pm;
    return pm;
  }

  getParticipateUserRoleList(type) {
    if (type === 'dev') {
      let devParticipateUserRoleList = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participateUserRoleList.length; i++) {
        devParticipateUserRoleList = this.participateUserRoleList[i].dev + devParticipateUserRoleList;
      }
      if (devParticipateUserRoleList > 0) {
        devParticipateUserRoleList = (devParticipateUserRoleList / 60);
      }
      return devParticipateUserRoleList;
    } else if (type === 'des') {
      let desParticipateUserRoleList = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participateUserRoleList.length; i++) {
        desParticipateUserRoleList = this.participateUserRoleList[i].des + desParticipateUserRoleList;
      }
      if (desParticipateUserRoleList > 0) {
        desParticipateUserRoleList = (desParticipateUserRoleList / 60);
      }
      return desParticipateUserRoleList;
    } else if (type === 'qa') {
      let qaParticipateUserRoleList = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participateUserRoleList.length; i++) {
        qaParticipateUserRoleList = this.participateUserRoleList[i].qa + qaParticipateUserRoleList;
      }
      if (qaParticipateUserRoleList > 0) {
        qaParticipateUserRoleList = (qaParticipateUserRoleList / 60);
      }
      return qaParticipateUserRoleList;
    } else {
      let pmParticipateUserRoleList = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participateUserRoleList.length; i++) {
        pmParticipateUserRoleList = this.participateUserRoleList[i].pm + pmParticipateUserRoleList;
      }
      if (pmParticipateUserRoleList > 0) {
        pmParticipateUserRoleList = (pmParticipateUserRoleList / 60);
      }
      return pmParticipateUserRoleList;
    }
  }

  getDesignPrototype(time) {
    return Number(time.des / 60);
  }
  getDesignQaPrototype(time) {
    return Number(time.qa / 60);
  }
}
