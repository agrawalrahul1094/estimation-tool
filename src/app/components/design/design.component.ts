import {AfterContentInit, AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpApiService} from '../../shared/http-api.service';
import {CommonService} from '../../shared/common.service';
import {AuthService} from '../../shared/auth-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.styl']
})
export class DesignComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  urls = [];
  brandingTab = 'Default BTS Branding';
  brandingList = [
    {name: 'Default BTS Branding'},
    {name: 'Client Branding - Basic'},
    {name: 'Client Branding - Custom'},
  ];

  prototypeTab = '';
  prototypeList = [
    {name: 'Required'},
    {name: 'Not Required'}
  ];

  deviceTab = 'All Devices';
  deviceList = [
    {name: 'All Devices'},
    {name: 'iPad & Desktop'},
    {name: 'iPad Only'},
    {name: 'Desktop Only'},
  ];

  browserTab = [];
  browserList = [
    {name: 'Chrome', checked: true},
    {name: 'Internet Explorer', checked: true},
    {name: 'Mozilla Firefox', checked: true},
    {name: 'Edge', checked: true},
    {name: 'Safari', checked: true},
  ];

  clientBrancdCustom = new FormControl('');
  prototypeAdditional = new FormControl('');
  specificDevice = new FormControl('');
  constructor(private http: HttpApiService, private commonService: CommonService,
              private authService: AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.browserTab = this.browserList;
  }

  ngAfterViewInit(): void {
    this.browserTab = [];
    const setInt = setInterval(() => {
      const contentData: any = this.commonService.contentObject;
      if (contentData && contentData.content && contentData.content.design) {
        this.browserTab = contentData.content.design.browserTab;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.browserList.length; i ++) {
          const checked = this.browserTab.map((o) => { return o.name; }).indexOf(this.browserList[i].name);
          if (checked === -1) {
            this.browserList[i].checked = false;
          } else {
            this.browserList[i].checked = true;
          }
        }
        this.brandingTab = contentData.content.design.brandingTab;
        this.clientBrancdCustom.setValue(contentData.content.design.clientBrancdCustom);
        this.prototypeTab = contentData.content.design.prototypeTab;
        this.prototypeAdditional.setValue(contentData.content.design.prototypeAdditional);
        this.deviceTab = contentData.content.design.deviceTab;
        this.specificDevice.setValue(contentData.content.design.specificDevice);
        clearInterval(setInt);
      }
    }, 500);
  }

  brandingTabFun(name) {
    this.brandingTab = name.name;
    if (this.brandingTab === 'Client Branding - Custom') {
      this.prototypeTab = 'Required';
    } else {
      this.prototypeTab = '';
    }
  }

  protoTypeTabFun(name) {
    this.prototypeTab = name.name;
  }

  deviceTabFun(name) {
    this.browserTab = [];
    this.deviceTab = name.name;
    if (this.deviceTab === 'All Devices') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.browserList.length; i++) {
        this.browserList[i].checked = true;
        this.browserTab.push(this.browserList[i]);
      }
    } else if (this.deviceTab === 'iPad & Desktop') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.browserList.length; i++) {
        if (this.browserList[i].name === 'Chrome' || this.browserList[i].name === 'Safari') {
          this.browserList[i].checked = true;
          this.browserTab.push(this.browserList[i]);
        } else {
          this.browserList[i].checked = false;
        }
       }
    } else if (this.deviceTab === 'iPad Only') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.browserList.length; i++) {
        if (this.browserList[i].name === 'Safari') {
          this.browserList[i].checked = true;
          this.browserTab.push(this.browserList[i]);
        } else {
          this.browserList[i].checked = false;
        }
      }
    } else if (this.deviceTab === 'Desktop Only') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.browserList.length; i++) {
        if (this.browserList[i].name === 'Chrome') {
          this.browserList[i].checked = true;
          this.browserTab.push(this.browserList[i]);
        } else {
          this.browserList[i].checked = false;
        }
      }
    }
  }

  checkBrowserListType(brow) {
    const index = this.browserTab.indexOf(brow.name);
    if (index === -1) {
      brow.checked = true;
      this.browserTab.push(brow);
    } else {
      this.browserTab.splice(index, 1);
    }
  }

  onSelectFile(event) {
    localStorage.removeItem('file')
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();

        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
          // @ts-ignore
          localStorage.setItem('file', JSON.stringify(this.urls));
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  save() {
    if (this.prototypeTab === '') {
      this.authService.openSnackBar('Please select prototype', false);
      return false;
    }
    if (this.browserTab.length === 0) {
      this.authService.openSnackBar('Please select browser support', false);
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


    if (this.brandingList[0].name === this.brandingTab || this.brandingList[1].name === this.brandingTab) {
      this.clientBrancdCustom.setValue('');
    }


    const design = {
      brandingTab: this.brandingTab,
      browserTab: this.browserTab,
      clientBrancdCustom: this.clientBrancdCustom.value,
      file: [],
      prototypeTab: this.prototypeTab,
      prototypeAdditional: this.prototypeAdditional.value,
      deviceTab: this.deviceTab,
      specificDevice: this.specificDevice.value
    };

    const formData = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        participant,
        hostingStrategy,
        design,
        content,
        score,
        structure
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
    this.nextStep.emit('5');
  }
}
