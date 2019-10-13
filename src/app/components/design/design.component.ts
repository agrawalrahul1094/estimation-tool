import { Component, OnInit } from '@angular/core';
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
export class DesignComponent implements OnInit {
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
  constructor(private http: HttpApiService, private commonService: CommonService,
              private authService: AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.browserTab = this.browserList;
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
      for (let i = 0; i < this.browserList.length; i++) {
        this.browserList[i].checked = true;
        this.browserTab.push(this.browserList[i]);
      }
    } else if (this.deviceTab === 'iPad & Desktop') {
      for (let i = 0; i < this.browserList.length; i++) {
        if (this.browserList[i].name === 'Chrome' || this.browserList[i].name === 'Safari') {
          this.browserList[i].checked = true;
          this.browserTab.push(this.browserList[i]);
        } else {
          this.browserList[i].checked = false;
        }
       }
    } else if (this.deviceTab === 'iPad Only') {
      for (let i = 0; i < this.browserList.length; i++) {
        if (this.browserList[i].name === 'Safari') {
          this.browserList[i].checked = true;
          this.browserTab.push(this.browserList[i]);
        } else {
          this.browserList[i].checked = false;
        }
      }
    } else if (this.deviceTab === 'Desktop Only') {
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
    console.log(this.browserTab)
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


    if (this.brandingList[0].name === this.brandingTab || this.brandingList[1].name === this.brandingTab) {
      this.clientBrancdCustom.setValue('');
    }

    let file: any = [];
    if (this.brandingList[2].name === this.brandingTab) {
      file = JSON.stringify(localStorage.getItem('file'));
    }
    // const files = localStorage.getItem('file');
    //
    // for (let i = 0; i < files.length; i++) {
    //   console.log(files[i])
    // }

    const design = {
      browserTab: this.browserTab,
      clientBrancdCustom: this.clientBrancdCustom.value,
      file: [],
      prototypeTab: this.prototypeTab,
      prototypeAdditional: this.prototypeAdditional.value,
      deviceTab: this.deviceTab
    };

    const formData = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        participant,
        hostingStrategy,
        design
      }
    };

    this.http.postApi('content', formData).subscribe(res => {
      console.log(res)
    })
  }
}
