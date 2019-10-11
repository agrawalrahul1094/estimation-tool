import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {HttpApiService} from '../../shared/http-api.service';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/auth-service.service';
import {CommonService} from '../../shared/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  createRequestForm: FormGroup;
  createRequest = false;

  constructor(public httpApi: HttpApiService, private router: Router,
              private authService: AuthService,
              private commonService: CommonService,
              private spinner: NgxSpinnerService
              ) {
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/details']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.required)
    });
    this.createRequestForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      eventName: new FormControl('', Validators.required),
      projectID: new FormControl(''),
    });
  }

  login(formData) {
    this.spinner.show();
    this.httpApi.postApi('login', formData).subscribe(res => {
        const result: any = res;
        if (result.success) {
          this.authService.openSnackBar('Successfully login', true);
          localStorage.setItem('token', result.token);
          // this.commonService.loginSubject.next(true);
          this.createRequest = true;
          this.spinner.hide();
          // this.router.navigate(['/dashboard']);
        } else {
          this.spinner.hide();
          this.authService.openSnackBar(result.message, false);
        }
      },
      err => {
        if (err) {
          this.spinner.hide();
          console.log(err);
        }
      });
  }

  createRequestFun(formData) {
    this.spinner.show();
    this.httpApi.postApi('createRequest', formData).subscribe(res => {
        const result: any = res;
        if (result.success) {
          localStorage.setItem('_id', result.message._id);
          this.commonService.contentObject = {
              createRequest: result.message
          };
          this.authService.openSnackBar('Successfully create', true);
          this.commonService.loginSubject.next(true);
          // this.createRequest = true;
          this.router.navigate(['/details']);
        } else {
          this.authService.openSnackBar(result.message, false);
        }
        this.spinner.hide();
      },
      err => {
        if (err) {
          this.spinner.hide();
          console.log(err);
        }
      });
  }

}
