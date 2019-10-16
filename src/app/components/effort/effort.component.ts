import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-effort',
  templateUrl: './effort.component.html',
  styleUrls: ['./effort.component.styl']
})
export class EffortComponent implements OnInit {

  constructor(private commonService: CommonService,) { }
  effortsParam: Array<any> = [];
  totalEffort;
  ngOnInit() {
    this.effortsParam = [
      {value: this.commonService.qaTime,
      label: 'Development'},  
      {value: this.commonService.pmTime,
      label: 'Design'},  
      {value: this.commonService.devTime,
      label: 'QA'},  
      {value: this.commonService.desTime,
      label: 'PM'}
    ];
    this.totalEffort = this.commonService.totTime;
  }

}
