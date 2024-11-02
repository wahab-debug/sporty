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
import { AddsessionComponent } from './components/sessions/addsession/addsession.component';
import { AddsportComponent } from './components/sessions/sports/addsport/addsport.component';
import { GamesComponent } from './components/sessions/sports/games/games.component';
import { OffergamesComponent } from './components/sessions/offergames/offergames.component';
import { EditUserComponent } from './components/userlist/edit-user/edit-user.component';
import { TeamComponent } from './components/team/team.component';
import { EditTeamComponent } from './components/team/edit-team/edit-team.component';
import { PlayerComponent } from './components/team/player/player.component';
import { EditPlayerComponent } from './components/team/player/edit-player/edit-player.component';
import { AddteamComponent } from './components/team/addteam/addteam.component';
import { AddplayerComponent } from './components/team/player/addplayer/addplayer.component';
import { MatchComponent } from './components/match/match.component';
import { EditMatchComponent } from './components/match/edit-match/edit-match.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { EnrollTeamComponent } from './components/enroll-team/enroll-team.component';

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
    AddsessionComponent,
    AddsportComponent,
    GamesComponent,
    OffergamesComponent,
    EditUserComponent,
    TeamComponent,
    EditTeamComponent,
    PlayerComponent,
    EditPlayerComponent,
    AddteamComponent,
    AddplayerComponent,
    MatchComponent,
    EditMatchComponent,
    SchedulesComponent,
    EnrollTeamComponent,
  
    
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
