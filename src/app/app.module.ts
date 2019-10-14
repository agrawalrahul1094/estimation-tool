import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthIntercepterService} from './shared/auth-intercepter.service';
import {NotificationComponent} from './common/notification/notification.component';
import {MaterialModule} from './shared/material.module';
import { EffortComponent } from './components/effort/effort.component';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    EffortComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercepterService,
      multi: true
    }
  ],
  entryComponents: [
    NotificationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
