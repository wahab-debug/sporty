import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
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
import { AddteamComponent } from './components/team/addteam/addteam.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { EnrollTeamComponent } from './components/enroll-team/enroll-team.component';
import { CreateScheduleComponent } from './components/schedules/create-schedule/create-schedule.component';
import { GameRulesComponent } from './components/game-rules/game-rules.component';
import { GameRulesModComponent } from './components/game-rules/game-rules-mod/game-rules-mod.component';
import { ScoringComponent } from './components/scoring/scoring.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { UpdateScheduleComponent } from './components/schedules/update-schedule/update-schedule.component';
import { ScCricketComponent } from './components/scoring/sc-cricket/sc-cricket.component';
import { ScGoalbaseComponent } from './components/scoring/sc-goalbase/sc-goalbase.component';
import { ScPointbaseComponent } from './components/scoring/sc-pointbase/sc-pointbase.component';
import { ScTurnbaseComponent } from './components/scoring/sc-turnbase/sc-turnbase.component';
import { PerformanceGistComponent } from './components/scoring/sc-cricket/performance-gist/performance-gist.component';
import { InstructionsallComponent } from './components/game-rules/instructionsall/instructionsall.component';

@NgModule({
  declarations: [
    AppComponent,
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
    AddteamComponent,
    SchedulesComponent,
    EnrollTeamComponent,
    CreateScheduleComponent,
    GameRulesComponent,
    GameRulesModComponent,
    ScoringComponent,
    ScoreboardComponent,
    UpdateScheduleComponent,
    ScCricketComponent,
    ScGoalbaseComponent,
    ScPointbaseComponent,
    ScTurnbaseComponent,
    PerformanceGistComponent,
    InstructionsallComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,   
    HttpClientModule ,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    HttpClient

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
