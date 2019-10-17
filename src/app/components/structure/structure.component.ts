import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../shared/auth-service.service';
import {CommonService} from '../../shared/common.service';
import {HttpApiService} from '../../shared/http-api.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.styl']
})
export class StructureComponent implements OnInit, AfterViewInit {
  @Output() nextStep: EventEmitter<string> = new EventEmitter<string>();
  round = new FormControl('');
  leftSelect = [];
  rightSelect = [];

  leftColumn = [
    {name: 'Identifier', checked: false, value: 1, qa: 20, dev: 10, pm: 0, des: 0},
    {name: 'Team Name Entry', checked: false, value: 1, qa: 20, dev: 20, pm: 0, des: 0},
    {name: 'Info (Case Study/Scenario )', checked: false, value: 1, qa: 15, dev: 20, pm: 0, des: 0},
    {name: 'Image', checked: false, value: 1, qa: 15, dev: 20, pm: 0, des: 0},
    {name: 'Carousel', checked: false, value: 1, qa: 30, dev: 20, pm: 0, des: 0},
    {name: 'Team Info', checked: false, value: 1, qa: 30, dev: 60, pm: 0, des: 0},
    {name: 'Idea hunt', checked: false, value: 1, qa: 20, dev: 90, pm: 0, des: 0},
    {name: 'Video hunt', checked: false, value: 1, qa: 30, dev: 90, pm: 0, des: 0},
    {name: 'Brainstorm', checked: false, value: 1, qa: 0, dev: 40, pm: 0, des: 0},
    {name: 'Custom Activity', checked: false, value: 1, qa: 0, dev: 0, pm: 0, des: 0},
    {name: 'Leader Board', checked: false, value: 1, qa: 0, dev: 0, pm: 0, des: 0},
  ];

  rightColumn = [
    {name: 'Single Select', checked: false, value: 1, feedback: false, result: false, qa: 20, dev: 40, pm: 0, des: 0},
    {name: 'Multiple Select', checked: false, value: 1, feedback: false, result: false, qa: 15, dev: 40, pm: 0, des: 0},
    {name: 'Slider', checked: false, value: 1, feedback: false, result: false, qa: 20, dev: 0, pm: 0, des: 0},
    {name: 'Drag & Drop', checked: false, value: 1, feedback: false, result: false, qa: 0, dev: 40, pm: 0, des: 0},
    {name: 'Dropdown', checked: false, value: 1, feedback: false, result: false, qa: 30, dev: 40, pm: 0, des: 0},
    {name: 'Scale-Rating', checked: false, value: 1, feedback: false, result: false, qa: 30, dev: 40, pm: 0, des: 0},
    {name: 'Toggle', checked: false, value: 1, feedback: false, result: false, qa: 15, dev: 40, pm: 0, des: 0}
  ];

  constructor(private authService: AuthService, private commonService: CommonService,
              private http: HttpApiService, private spinner: NgxSpinnerService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const setInt = setInterval(() => {
      const contentData: any = this.commonService.contentObject;
      if (contentData && contentData.content && contentData.content.structure) {
        this.round.setValue(contentData.content.structure.round);
        this.leftSelect = contentData.content.structure.leftSelect;
        this.rightSelect = contentData.content.structure.rightSelect;
        this.commonService.structureActivitiesList = [...this.leftSelect, ...this.rightSelect];
        this.commonService.timeEfforts('', '', '');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.leftSelect.length; i ++) {
          const checked = this.leftSelect.map((o) => { return o.name; }).indexOf(this.leftSelect[i].name);
          if (!(checked === -1)) {
            this.leftColumn[checked].checked = true;
            this.leftColumn[checked].value = this.leftSelect[i].value;
          }
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.rightSelect.length; i ++) {
          const checked = this.rightColumn.map((o) => { return o.name; }).indexOf(this.rightSelect[i].name);
          if (!(checked === -1)) {
            this.rightColumn[checked].checked = true;
            this.rightColumn[checked].value = this.rightSelect[i].value;
            this.rightColumn[checked].feedback = this.rightSelect[i].feedback;
            this.rightColumn[checked].result = this.rightSelect[i].result;
          }
        }
        clearInterval(setInt);
      }
    }, 500);
  }

  leftColumnTab(left, i) {
    const index = this.leftSelect.indexOf(left);
    if (index === -1) {
      this.leftColumn[i].checked = true;
      this.leftSelect.push(left);
      this.addTimeEfforts(left, 'add');
    } else {
      this.leftColumn[i].checked = false;
      this.leftColumn[i].value = 1;
      this.leftSelect.splice(index, 1);
      this.addTimeEfforts(left, 'minus');
    }
  }

  addTimeEfforts(obj, type) {
    if (type === 'add') {
      this.commonService.structureActivitiesList.push(obj);
      this.commonService.timeEfforts('', '', '');
    } else {
      const index = this.commonService.structureActivitiesList.indexOf(obj);
      this.commonService.structureActivitiesList.splice(index, 1);
      this.commonService.timeEfforts('', '', '');
    }
  }

  rightColumnTab(right, i) {
    const index = this.rightSelect.indexOf(right);
    if (index === -1) {
      this.rightColumn[i].checked = true;
      this.rightSelect.push(right);
      this.addTimeEfforts(right, 'add');
    } else {
      this.rightColumn[i].checked = false;
      this.rightColumn[i].value = 1;
      this.rightSelect.splice(index, 1);
      this.addTimeEfforts(right, 'minus');
    }
  }

  onChange(obj) {
    const checked = this.rightSelect.map((o) => { return o.name; }).indexOf(obj.name);
    this.rightSelect[checked].feedback = obj.feedback;
    this.rightSelect[checked].result = obj.result;
    this.commonService.timeEfforts('', '', '');
  }

  onChangeNumber(obj, e, side) {
    if (side === 'right') {
      const checked = this.rightSelect.map((o) => { return o.name; }).indexOf(obj.name);
      this.rightSelect[checked].value = e.target.value;
    } else {
      const checked = this.leftSelect.map((o) => { return o.name; }).indexOf(obj.name);
      this.leftSelect[checked].value = e.target.value;
    }
  }

  save() {
    if (this.round.value === '') {
      this.authService.openSnackBar('Please enter number of round', false);
      return false;
    }

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
    let content = {};
    if (contentData.content && contentData.content.content !== undefined) {
      content = contentData.content.content;
    }
    let score = {};
    if (contentData.content && contentData.content.score !== undefined) {
      score = contentData.content.score;
    }
    let participant = {};
    if (contentData.content && contentData.content.participant !== undefined) {
      participant = contentData.content.participant;
    }

    const structure = {
      round: this.round.value,
      rightSelect: this.rightSelect,
      leftSelect: this.leftSelect
    };
    const formdata = {
      createRequestID: localStorage.getItem('_id'),
      content: {
        basicInfo,
        hostingStrategy,
        participant,
        design,
        content,
        structure,
        score,
        timeEfforts: this.commonService.calcObj,
        participateUserRoleList: this.commonService.participateUserRoleList,
        structureActivitiesList: this.commonService.structureActivitiesList,
        hostingDeploymentList: this.commonService.hostingDeploymentList
      }
    };

    this.spinner.show();
    this.http.postApi('content', formdata).subscribe(res => {
      const result: any = res;
      if (result.success) {
        this.authService.openSnackBar('Successfully added', true);
        this.http.getApi('content/' + localStorage.getItem('_id')).subscribe(res1 => {
          const ret: any = res1;
          this.commonService.contentObject = ret.message;
          this.nextStepFun();
        });
      } else {
        this.authService.openSnackBar('Please try again', false);
      }
    });
  }

  nextStepFun() {
    this.nextStep.emit('6');
  }
}
