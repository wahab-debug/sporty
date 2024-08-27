import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms'
import { LoginComponent } from './components/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserlistComponent } from './components/userlist/userlist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SportsComponent } from './components/sessions/sports/sports.component';
import { ScheduleComponent } from './components/sessions/sports/schedule/schedule.component';
import { AddsessionComponent } from './components/sessions/addsession/addsession.component';
import { AddsportComponent } from './components/sessions/sports/addsport/addsport.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    UserlistComponent,
    DashboardComponent,
    NavbarComponent,
    RegisterComponent,
    SessionsComponent,
    SportsComponent,
    ScheduleComponent,
    AddsessionComponent,
    AddsportComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,   
    HttpClientModule ,
    ToastrModule.forRoot()
  ],
  providers: [
    provideAnimationsAsync(),
    HttpClient

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
