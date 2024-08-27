import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserlistComponent } from './components/userlist/userlist.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { SessionsComponent } from './components/sessions/sessions.component';
import { AddsessionComponent } from './components/sessions/addsession/addsession.component';
import { AddsportComponent } from './components/sessions/sports/addsport/addsport.component';
import { SportsComponent } from './components/sessions/sports/sports.component';

const routes: Routes = [
  
  {
    path:'',
    component: SportsComponent, 
  },
  {
    path:'userlist',
    component: UserlistComponent,
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
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
