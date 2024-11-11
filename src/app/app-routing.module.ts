import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserlistComponent } from './components/userlist/userlist.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { SessionsComponent } from './components/sessions/sessions.component';
import { AddsessionComponent } from './components/sessions/addsession/addsession.component';
import { AddsportComponent } from './components/sessions/sports/addsport/addsport.component';
import { SportsComponent } from './components/sessions/sports/sports.component';
import { GamesComponent } from './components/sessions/sports/games/games.component';
import { OffergamesComponent } from './components/sessions/offergames/offergames.component';
import { EditUserComponent } from './components/userlist/edit-user/edit-user.component';
import { TeamComponent } from './components/team/team.component';
import { EditTeamComponent } from './components/team/edit-team/edit-team.component';
import { AddteamComponent } from './components/team/addteam/addteam.component';
import { PlayerComponent } from './components/team/player/player.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { EnrollTeamComponent } from './components/enroll-team/enroll-team.component';
import { CreateScheduleComponent } from './components/schedules/create-schedule/create-schedule.component';
import { GameRulesComponent } from './components/game-rules/game-rules.component';
import { GameRulesModComponent } from './components/game-rules/game-rules-mod/game-rules-mod.component';
import { ScoringComponent } from './components/scoring/scoring.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

const routes: Routes = [
  
  {
    path:'',
    component: DashboardComponent, 
  },
  {
    path:'userlist',
    component: UserlistComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'userlist/edit/:registration_no',
    component: EditUserComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'session',
    component: SessionsComponent,
  },
  {
    path: 'addsession',
    component: AddsessionComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'addsport',
    component: AddsportComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'allsports',
    component: SportsComponent
  },
  {
    path: 'appgames',
    component: GamesComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'offergames',
    component: OffergamesComponent,
    canActivate:[AuthGuard]
  },
 {
    path:'allsports/schedules/:game',
    component: SchedulesComponent,
  },
  {
    path:'schedules/:game',
    component: SchedulesComponent,
  },
  {
    path:'schedules/create-schedule/:game',
    component: CreateScheduleComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'scoring',
    component: ScoringComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'score-board',
    component: ScoreboardComponent,
  },
  {
    path:'rules',
    component: GameRulesComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'mod-rules',
    component: GameRulesModComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    component: TeamComponent
  },
  {
    path: 'my-team',
    component: AddteamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams/edit/:teamid',
    component: EditTeamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams/team-player/:teamid',
    component: PlayerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'approve-teams/team-player/:teamid',
    component: PlayerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enroll-team',
    component: EnrollTeamComponent,
    canActivate: [AuthGuard]
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
