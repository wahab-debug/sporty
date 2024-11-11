import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements DoCheck ,OnInit{
  isLoggedin = false;
  isAdmin = false;
  isMod = false;
  isCaptain = false;
  isUser = false;
  reg = sessionStorage.getItem('registration_no');
  role = sessionStorage.getItem('role');
  constructor(private service: AuthService, private router: Router){
    this.isLoggedin = !!this.service.isLoggedIn();
  }
  ngOnInit(): void {
    this.updateUserRole();
  }
  toggleAuth(){
    if(this.isLoggedin){
      sessionStorage.removeItem('registration_no');
      sessionStorage.removeItem('role');
      this.isLoggedin = false;
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/login']);
    }
  }
  ngDoCheck(): void {
  this.updateUserRole();
  }
  private updateUserRole(): void {
    
    const role = this.service.getUserRole();
    this.isAdmin = role === 'Admin';
    this.isMod = role === 'Mod';
    this.isCaptain = role === 'Captain';
    this.isUser = role === 'User';
}

}
