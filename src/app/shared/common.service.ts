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
  // @ts-ignore
  public participateUserRoleList: Array[] = [];
  structureActivitiesList = [];

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
    },
    structure: {
      structureActivitiesList: []
    },
    content: {
      contentSupport: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      },
      contentInput: {
        qa: 0,
        dev: 0,
        pm: 0,
        des: 0
      }
    }
  };

  constructor(private spinner: NgxSpinnerService, private http: HttpApiService, private authService: AuthService) {

  }

  passingLoginSubject() {
    return this.loginSubject.asObservable();
  }

  getTimeEfforts() {
    this.devTime = this.totalDevelopementTimeEfforts();
    this.desTime = this.totalDesigningTimeEfforts();
    this.qaTime = this.totalQaTimeEfforts();
    this.pmTime = this.totalPmTimeEfforts();

    const total = this.devTime + this.desTime + this.qaTime + this.pmTime;
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
    } else if (type === 'content') {
      if (module === 'contentSupport') {
        qaHrs = Number(time.qa / 60);
        this.calcObj.content.contentSupport.dev = 0;
        this.calcObj.content.contentSupport.des = 0;
        this.calcObj.content.contentSupport.qa = qaHrs;
        this.calcObj.content.contentSupport.pm = 0;
      } else if (module === 'contentInput') {
        devHrs = Number(time.dev / 60);
        this.calcObj.content.contentInput.dev = devHrs;
        this.calcObj.content.contentInput.des = 0;
        this.calcObj.content.contentInput.qa = 0;
        this.calcObj.content.contentInput.pm = 0;
      }
    }

    this.devTime = this.totalDevelopementTimeEfforts();
    this.desTime = this.totalDesigningTimeEfforts();
    this.qaTime = this.totalQaTimeEfforts();
    this.pmTime = this.totalPmTimeEfforts();
    const total = this.devTime + this.desTime + this.qaTime + this.pmTime;
    this.totTime = Number(total.toFixed(2));
  }

  totalDevelopementTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('dev');
    const structureActivitiesList = this.structureActivitiesListFunc('dev');
    const dev = this.calcObj.basicInfo.navigate.dev +
      this.calcObj.basicInfo.multiLang.dev +
      this.calcObj.hostingStrategy.deployement.dev +
      this.calcObj.hostingStrategy.signUp.dev +
      this.calcObj.participate.userType.dev +
      this.calcObj.participate.scaleTesting.dev + getParticipateUserRoleList +
      this.calcObj.design.protoType.dev + structureActivitiesList +
      this.calcObj.design.device.dev +
      this.calcObj.content.contentSupport.dev +
      this.calcObj.content.contentInput.dev;
    return dev;
  }

  totalDesigningTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('des');
    const structureActivitiesList = this.structureActivitiesListFunc('des');
    const des = this.calcObj.basicInfo.navigate.des +
      this.calcObj.basicInfo.multiLang.des +
      this.calcObj.hostingStrategy.deployement.des +
      this.calcObj.hostingStrategy.signUp.des +
      this.calcObj.participate.userType.des +
      this.calcObj.participate.scaleTesting.des + getParticipateUserRoleList +
      this.calcObj.design.protoType.des + structureActivitiesList +
      this.calcObj.design.device.des +
      this.calcObj.content.contentSupport.des;
    return des;
  }

  totalQaTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('qa');
    const structureActivitiesList = this.structureActivitiesListFunc('qa');
    const qa = this.calcObj.basicInfo.navigate.qa +
      this.calcObj.basicInfo.multiLang.qa +
      this.calcObj.hostingStrategy.deployement.qa +
      this.calcObj.hostingStrategy.signUp.qa +
      this.calcObj.participate.userType.qa +
      this.calcObj.participate.scaleTesting.qa + getParticipateUserRoleList +
      this.calcObj.design.protoType.qa + structureActivitiesList +
      this.calcObj.design.device.qa +
      this.calcObj.content.contentSupport.qa;
    return qa;
  }

  totalPmTimeEfforts() {
    const getParticipateUserRoleList = this.getParticipateUserRoleList('pm');
    const structureActivitiesList = this.structureActivitiesListFunc('pm');
    const pm = this.calcObj.basicInfo.navigate.pm +
      this.calcObj.basicInfo.multiLang.pm +
      this.calcObj.hostingStrategy.deployement.pm +
      this.calcObj.hostingStrategy.signUp.pm +
      this.calcObj.participate.userType.pm +
      this.calcObj.participate.scaleTesting.pm + getParticipateUserRoleList +
      this.calcObj.design.protoType.pm + structureActivitiesList +
      this.calcObj.design.device.pm +
      this.calcObj.content.contentSupport.pm;
    return pm;
  }

  getParticipateUserRoleList(type) {
    let devParticipateUserRoleList = 0;
    if (this.participateUserRoleList) {
      if (type === 'dev') {
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
    } else {
      return  devParticipateUserRoleList;
    }
  }

  structureActivitiesListFunc(type) {
    let devstructureActivitiesList = 0;
    if (this.structureActivitiesList) {
      if (type === 'dev') {
        let feedback = 0;
        let result = 0;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.structureActivitiesList.length; i++) {
          if (this.structureActivitiesList[i].feedback) {
            feedback = feedback + 30;
          }
          if (this.structureActivitiesList[i].result) {
            result = result + 30;
          }
          devstructureActivitiesList = this.structureActivitiesList[i].dev + devstructureActivitiesList;
        }
        const res = Number(result / 60);
        const feed = Number(feedback / 60);
        if (devstructureActivitiesList > 0) {
          devstructureActivitiesList = (devstructureActivitiesList / 60);
        }
        return Number(devstructureActivitiesList + res + feed);
      } else if (type === 'qa') {
        let devstructureActivitiesList = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.structureActivitiesList.length; i++) {
          devstructureActivitiesList = this.structureActivitiesList[i].qa + devstructureActivitiesList;
        }
        if (devstructureActivitiesList > 0) {
          devstructureActivitiesList = (devstructureActivitiesList / 60);
        }
        return devstructureActivitiesList;
      } else if (type === 'pm') {
        let devstructureActivitiesList = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.structureActivitiesList.length; i++) {
          devstructureActivitiesList = this.structureActivitiesList[i].pm + devstructureActivitiesList;
        }
        if (devstructureActivitiesList > 0) {
          devstructureActivitiesList = (devstructureActivitiesList / 60);
        }
        return devstructureActivitiesList;
      } else if (type === 'des') {
        let devstructureActivitiesList = 0;
        const contentObj: any = this.contentObject;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.structureActivitiesList.length; i++) {
          if (contentObj.content.design.brandingTab === 'Default BTS Branding') {
            if (this.structureActivitiesList[i].name === 'Identifier' ||
              this.structureActivitiesList[i].name === 'Idea hunt' ||
              this.structureActivitiesList[i].name === 'Video hunt' ||
              this.structureActivitiesList[i].name === 'Info (Case Study/Scenario )') {
              devstructureActivitiesList = 30 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Toggle') {
              devstructureActivitiesList = 45 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Leader Board') {
              devstructureActivitiesList = 15 + devstructureActivitiesList;
            }
          }
          if (contentObj.content.design.brandingTab === 'Client Branding - Basic') {
            if (this.structureActivitiesList[i].name === 'Identifier' ||
              this.structureActivitiesList[i].name === 'Carousel' ||
              this.structureActivitiesList[i].name === 'Team Info') {
              devstructureActivitiesList = 30 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Team Name Entry' ||
              this.structureActivitiesList[i].name === 'Info (Case Study/Scenario )' ||
              this.structureActivitiesList[i].name === 'Slider' ||
              this.structureActivitiesList[i].name === 'Drag & Drop' ||
              this.structureActivitiesList[i].name === 'Dropdown' ||
              this.structureActivitiesList[i].name === 'Scale-Rating' ||
              this.structureActivitiesList[i].name === 'Toggle' ||
              this.structureActivitiesList[i].name === 'Idea hunt' ||
              this.structureActivitiesList[i].name === 'Video hunt' ||
              this.structureActivitiesList[i].name === 'Brainstorm' ||
              this.structureActivitiesList[i].name === 'Custom Activity' ||
              this.structureActivitiesList[i].name === 'Leader Board' ||
              this.structureActivitiesList[i].name === 'Multiple Select' ||
              this.structureActivitiesList[i].name === 'Single Select') {
              devstructureActivitiesList = 15 + devstructureActivitiesList;
            }
          }
          if (contentObj.content.design.brandingTab === 'Client Branding - Custom') {
            if (this.structureActivitiesList[i].name === 'Identifier') {
              devstructureActivitiesList = 120 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Team Name Entry' ||
              this.structureActivitiesList[i].name === 'Info (Case Study/Scenario )' ||
              this.structureActivitiesList[i].name === 'Single Select' ||
              this.structureActivitiesList[i].name === 'Multiple Select' ||
              this.structureActivitiesList[i].name === 'Slider' ||
              this.structureActivitiesList[i].name === 'Drag & Drop' ||
              this.structureActivitiesList[i].name === 'Dropdown' ||
              this.structureActivitiesList[i].name === 'Image'
            ) {
              devstructureActivitiesList = 30 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Carousel' ||
              this.structureActivitiesList[i].name === 'Scale-Rating' ||
              this.structureActivitiesList[i].name === 'Toggle') {
              devstructureActivitiesList = 45 + devstructureActivitiesList;
            }
            if (this.structureActivitiesList[i].name === 'Info (Case Study/Scenario )' ||
              this.structureActivitiesList[i].name === 'Idea hunt' ||
              this.structureActivitiesList[i].name === 'Video hunt') {
              devstructureActivitiesList = 60 + devstructureActivitiesList;
            }
          }

        }
        if (devstructureActivitiesList > 0) {
          devstructureActivitiesList = (devstructureActivitiesList / 60);
        }
        return devstructureActivitiesList;
      }
    } else {
      return devstructureActivitiesList;
    }
  }

  getDesignPrototype(time) {
    return Number(time.des / 60);
  }

  getDesignQaPrototype(time) {
    return Number(time.qa / 60);
  }
}
