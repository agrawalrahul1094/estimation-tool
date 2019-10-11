import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.styl']
})
export class ParticipantsComponent implements OnInit {
  userTab = '';
  userList = [
    {name: 'Team'},
    {name: 'Indivisual'}
  ];

  userRole = [];
  userRoleList = [
    {name: 'Leader'},
    {name: 'Followers'},
    {name: 'Group Director'},
    {name: 'Coach'},
    {name: 'Facilitator'},
    {name: 'Reporter'}
  ];
  constructor() { }

  ngOnInit() {
  }

  userType(name) {
    this.userTab = name;
  }

  userRoleListType(name) {
    const index = this.userRole.indexOf(name);
    if (index === -1) {
      this.userRole.push(name);
    } else {
      this.userRole.splice(index, 1);
    }
  }

  checkUserRole(name) {
    if (this.userRole.indexOf(name) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
