import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './common/login/login.component';
import {MaterialModule} from './shared/material.module';
import {AuthGuard} from './shared/auth-guard.guard';
import {HeaderComponent} from './common/header/header.component';
import {BasicInfoComponent} from './components/basic-info/basic-info.component';
import {DefaultComponent} from './components/default/default.component';
import {HostingStrategyComponent} from './components/hosting-strategy/hosting-strategy.component';
import {ParticipantsComponent} from './components/participants/participants.component';
import {DesignComponent} from './components/design/design.component';
import {ContentComponent} from './components/content/content.component';
import {StructureComponent} from './components/structure/structure.component';
import {ScoreComponent} from './components/score/score.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'details', component: DefaultComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MaterialModule
  ],
  declarations: [
    LoginComponent,
    BasicInfoComponent,
    HeaderComponent,
    DefaultComponent,
    HostingStrategyComponent,
    ParticipantsComponent,
    DesignComponent,
    ContentComponent,
    StructureComponent,
    ScoreComponent
  ],
  exports: [RouterModule, HeaderComponent]
})
export class AppRoutingModule { }
